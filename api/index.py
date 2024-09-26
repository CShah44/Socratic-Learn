from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from langserve import add_routes
from langchain.prompts import ChatPromptTemplate, PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAI
import dotenv
import os

dotenv.load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_key = os.getenv("GEMINI_API_KEY")

chat_llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7, api_key=api_key)
llm = GoogleGenerativeAI(model="gemini-1.5-flash", temperature=0.7, api_key=api_key )

prompt = ChatPromptTemplate.from_template(
    "Tell me a joke about {topic}"
)

add_routes(app, prompt | chat_llm, path="/api/joke")

add_routes(app, llm, path="/api/gemini")

@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}