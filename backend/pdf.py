import fitz 
import re
import nltk

def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text

text = extract_text_from_pdf("backend/2025-26-Program-of-Studies-121124.pdf")
print(text)

cleaned_text = re.sub(r'[^\w\s\.\?]', '')  # Keep letters, numbers, spaces, dots, and question marks

nltk.download('punkt')

sentences = nltk.sent_tokenize(cleaned_text)
nltk.download('punkt')

sentences = nltk.sent_tokenize(cleaned_text)


# Extract course and teacher info
matches = re.findall(r'([A-Za-z]+\s\d{3})\s.*?(taught by|teacher:\s)(Mr\.|Ms\.|Mrs\.)\s([A-Za-z\s]+)', text)
for match in matches:
    course, _, _, teacher = match
    question = f"Who teaches {course}?"
    answer = f"{teacher.strip()} teaches {course}."
    # Save to dataset