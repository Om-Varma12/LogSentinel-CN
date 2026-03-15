from langchain_groq import ChatGroq
from prompts.playbook_prompt import PROMPT
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv
load_dotenv()

llm = ChatGroq(model = "openai/gpt-oss-120b")

with open('agents/SKILLS/playbook_skill.md', 'r') as f:
    SKILL = f.read()

def summarize_log(log: dict, score: float) -> dict:
    prompt = PROMPT.format(
        log_details = log,
        risk_score = score
    )
    response = llm.invoke([
        SystemMessage(content=SKILL),
        HumanMessage(content=prompt),
    ])
    
    # print(response.content)
    return response.content
    
    
    

# summarize_log({'IP': '233.223.117.90', 'Timestamp': '[27/Dec/2037:12:00:00 +0530]', 'Request Method': 'DELETE', 'Request': '/usr/admin HTTP/1.0', 'Status Code': 502, 'Response Size': 4963, 'Client s/w info': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4380.0 Safari/537.36 Edg/89.0.759.0', 'Request Processing Time': 45}, 59.6)