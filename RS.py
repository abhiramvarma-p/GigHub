import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import pymongo
from dotenv import load_dotenv
import os
import sys
import json

# Load environment variables
load_dotenv()

# MongoDB Connection
try:
    client = pymongo.MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/gighub'))
    db = client.gighub
except Exception as e:
    print(f"Error connecting to MongoDB: {str(e)}")
    sys.exit(1)

def collect_data():
    try:
        # Get all students (freelancers)
        students = list(db.users.find({'role': 'student'}))
        # Get all jobs
        jobs = list(db.jobs.find())
        # Get all applications
        applications = list(db.applications.find())
        
        if not students:
            raise ValueError("No students found in the database")
        if not jobs:
            raise ValueError("No jobs found in the database")
            
        return students, jobs, applications
    except Exception as e:
        print(f"Error collecting data: {str(e)}")
        sys.exit(1)

def create_dataframes(students, jobs, applications):
    try:
        # Create freelancers DataFrame
        freelancers = pd.DataFrame([{
            'freelancer_id': str(s['_id']),
            'name': s.get('name', ''),
            'skills': ', '.join([skill['name'] for skill in s.get('skills', [])]),
            'major': s.get('major', ''),
            'college': s.get('college', ''),
            'experience_level': s.get('experience', [{}])[0].get('title', '') if s.get('experience') else ''
        } for s in students])

        # Create jobs DataFrame
        jobs_df = pd.DataFrame([{
            'job_id': str(j['_id']),
            'title': j.get('title', ''),
            'company': j.get('company', ''),
            'required_skills': ', '.join([skill['name'] for skill in j.get('requiredSkills', [])]),
            'category': j.get('category', ''),
            'experience_level': j.get('experience', ''),
            'pay_amount': j.get('pay', {}).get('amount', 0),
            'pay_type': j.get('pay', {}).get('type', 'fixed'),
            'location': j.get('location', ''),
            'type': j.get('type', ''),
            'duration': j.get('duration', 0),
            'description': j.get('description', '')
        } for j in jobs])

        return freelancers, jobs_df
    except Exception as e:
        print(f"Error creating dataframes: {str(e)}")
        sys.exit(1)

def get_recommendations(freelancer_id, top_n=5):
    try:
        # Collect data
        students, jobs, applications = collect_data()
        freelancers, jobs_df = create_dataframes(students, jobs, applications)
        
        # Get freelancer info
        freelancer = freelancers[freelancers['freelancer_id'] == freelancer_id]
        if len(freelancer) == 0:
            raise ValueError(f"Freelancer with ID {freelancer_id} not found")
        
        freelancer_info = freelancer.iloc[0]
        
        # Combine features for matching
        freelancer_features = f"{freelancer_info['skills']} {freelancer_info['major']} {freelancer_info['experience_level']}"
        job_features = jobs_df.apply(lambda x: f"{x['required_skills']} {x['category']} {x['experience_level']} {x['description']}", axis=1)
        
        # Calculate similarity
        vectorizer = TfidfVectorizer(stop_words='english')
        job_matrix = vectorizer.fit_transform(job_features)
        freelancer_vector = vectorizer.transform([freelancer_features])
        
        # Get similarity scores
        similarity_scores = cosine_similarity(freelancer_vector, job_matrix)[0]
        
        # Get top recommendations
        top_indices = np.argsort(-similarity_scores)[:top_n]
        recommended_jobs = jobs_df.iloc[top_indices].copy()
        
        # Add match scores
        recommended_jobs.loc[:, 'match_score'] = similarity_scores[top_indices]
        recommended_jobs.loc[:, 'match_score'] = (recommended_jobs['match_score'] - recommended_jobs['match_score'].min()) / (recommended_jobs['match_score'].max() - recommended_jobs['match_score'].min())
        
        return recommended_jobs, freelancer_info
    except Exception as e:
        print(f"Error getting recommendations: {str(e)}")
        sys.exit(1)

def format_recommendations(recommendations, freelancer_info):
    try:
        output = {
            'freelancer': {
                'name': freelancer_info['name'],
                'major': freelancer_info['major'],
                'college': freelancer_info['college'],
                'skills': freelancer_info['skills']
            },
            'recommendations': []
        }
        
        for _, job in recommendations.iterrows():
            output['recommendations'].append({
                'title': job['title'],
                'company': job['company'],
                'category': job['category'],
                'required_skills': job['required_skills'],
                'experience_level': job['experience_level'],
                'pay': {
                    'amount': job['pay_amount'],
                    'type': job['pay_type']
                },
                'location': job['location'],
                'duration': job['duration'],
                'match_score': float(job['match_score'])
            })
        
        print(json.dumps(output, indent=2))
    except Exception as e:
        print(f"Error formatting recommendations: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    try:
        # Get freelancer ID from command line argument
        if len(sys.argv) < 2:
            print(json.dumps({
                'error': 'Please provide a freelancer ID as a command line argument'
            }))
            sys.exit(1)
        
        freelancer_id = sys.argv[1]
        recommendations, freelancer_info = get_recommendations(freelancer_id)
        format_recommendations(recommendations, freelancer_info)
    except Exception as e:
        print(json.dumps({
            'error': str(e),
            'details': 'Check if MongoDB is running and the database connection is correct'
        }))
        sys.exit(1)
