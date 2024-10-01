from fastapi import FastAPI, Response
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from langserve import add_routes
from langchain.prompts import ChatPromptTemplate, PromptTemplate
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAI
import dotenv
import os
from pydantic import BaseModel

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

new_prompt = ChatPromptTemplate.from_template("Essay in 400 words about: {prompt}")

add_routes(app, prompt | chat_llm, path="/api/joke")
add_routes(app, new_prompt | chat_llm, path="/api/gemini")

# maybe wont't need this
class RequestBody(BaseModel):
    prompt: str

@app.post("/api/gemini-old")
async def stream_response_from_gemini(request: RequestBody):
    prompt = request.prompt
    
    def generate_stream(prompt: str):
        for chunk in llm.stream(prompt):
            yield f"data: {chunk}\n\n"
    
        yield "data: [DONE]\n\n"
    
    return StreamingResponse(generate_stream(prompt), media_type="text/event-stream")

@app.get("/api/python")
def hello_world():
    return {"message": "Hello World"}