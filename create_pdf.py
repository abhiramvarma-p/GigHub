from fpdf import FPDF
import os

def create_pdf_from_text(input_file, output_file):
    # Create PDF object
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    
    # Read text file
    with open(input_file, 'r') as file:
        for line in file:
            # Add text to PDF
            pdf.cell(0, 10, txt=line.strip(), ln=True)
    
    # Save the PDF
    pdf.output(output_file)

if __name__ == "__main__":
    input_file = "sample_resume.txt"
    output_file = "sample_resume.pdf"
    
    if os.path.exists(input_file):
        create_pdf_from_text(input_file, output_file)
        print(f"PDF created successfully: {output_file}")
    else:
        print(f"Error: {input_file} not found") 