import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from pymongo import MongoClient
from bson import ObjectId
import sys

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['gighub']

def extract_skills(skills_data):
    if not skills_data:
        return []
    
    extracted_skills = []
    for skill in skills_data:
        if isinstance(skill, dict):
            skill_name = skill.get('name', '')
            if skill_name:
                extracted_skills.append(skill_name)
        else:
            extracted_skills.append(str(skill))
    return extracted_skills

def collect_data():
    # Get all students
    students = list(db.users.find({'role': 'student'}))
    
    # Get the specific job
    job_id = sys.argv[1]
    try:
        job = db.jobs.find_one({'_id': ObjectId(job_id)})
    except:
        print("Invalid job ID format")
        sys.exit(1)
    
    if not job:
        print("Job not found")
        sys.exit(1)
    
    return students, job

def create_dataframes(students, job):
    # Create student data
    student_data = []
    for student in students:
        skills = extract_skills(student.get('skills', []))
        student_data.append({
            'id': str(student['_id']),
            'name': student.get('name', ''),
            'major': student.get('major', ''),
            'college': student.get('college', ''),
            'skills': skills,
            'experience_level': student.get('experience_level', ''),
            'gpa': student.get('gpa', 0.0)
        })
    
    # Create DataFrames
    students_df = pd.DataFrame(student_data)
    
    # Get job requirements
    job_requirements = {
        'required_skills': extract_skills(job.get('requiredSkills', [])),
        'experience_level': job.get('experienceLevel', ''),
        'category': job.get('category', '')
    }
    
    return students_df, job_requirements

def get_recommendations(students_df, job_requirements):
    # Create TF-IDF vectorizer for skills
    vectorizer = TfidfVectorizer()
    
    # Combine all skills into a single string for each student
    students_df['skills_combined'] = students_df['skills'].apply(lambda x: ' '.join(x) if isinstance(x, list) else '')
    
    # Create TF-IDF matrix for skills
    if len(students_df) == 0:
        print("No students found in the database")
        sys.exit(1)
        
    skills_matrix = vectorizer.fit_transform(students_df['skills_combined'])
    
    # Create TF-IDF vector for job requirements
    job_skills = ' '.join(job_requirements['required_skills'])
    job_vector = vectorizer.transform([job_skills])
    
    # Calculate cosine similarity
    similarity_scores = cosine_similarity(job_vector, skills_matrix).flatten()
    
    # Add similarity scores to DataFrame
    students_df['match_score'] = similarity_scores
    
    # Filter by experience level if specified
    if job_requirements['experience_level']:
        students_df = students_df[students_df['experience_level'] == job_requirements['experience_level']]
    
    # Sort by match score and get top 5 students
    top_students = students_df.nlargest(5, 'match_score')
    
    return top_students

def format_recommendations(top_students):
    recommendations = []
    for _, student in top_students.iterrows():
        recommendations.append({
            'student_id': student['id'],
            'name': student['name'],
            'major': student['major'],
            'college': student['college'],
            'skills': student['skills'],
            'experience_level': student['experience_level'],
            'gpa': float(student['gpa']),
            'match_score': float(student['match_score'])
        })
    
    return recommendations

def main():
    try:
        if len(sys.argv) != 2:
            print("Please provide a job ID")
            sys.exit(1)
            
        # Collect data
        students, job = collect_data()
        
        # Create DataFrames
        students_df, job_requirements = create_dataframes(students, job)
        
        # Get recommendations
        top_students = get_recommendations(students_df, job_requirements)
        
        # Format recommendations
        recommendations = format_recommendations(top_students)
        
        # Print recommendations as JSON
        print('{"recommendations": ' + pd.DataFrame(recommendations).to_json(orient='records') + '}')
        
    except Exception as e:
        print(f'{{"error": "{str(e)}"}}')
        sys.exit(1)

if __name__ == "__main__":
    main() 