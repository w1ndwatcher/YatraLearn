from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from chat.models import ChatHistory
import os
from dotenv import load_dotenv

load_dotenv(override=True)

llm = ChatGroq(
    groq_api_key=os.getenv('GROQ_API_KEY'),
    model_name="llama-3.1-8b-instant"
)


def generate_chat_response(participant, user_message):

    session = participant.session

    # Build context
    system_prompt = f"""
    You are a virtual experiential learning coach.

    Session Title: {session.title}
    Learning Objectives: {session.learning_objectives}
    Design: {session.design}

    Participant Role: {participant.role}

    Use the "What? So What? Then What?" reflection model.

    Encourage deep thinking.
    Ask follow-up questions.
    Extract goals.
    Keep conversation meaningful and engaging.
    """

    # Get previous messages
    history = ChatHistory.objects.filter(
        participant=participant
    ).order_by("timestamp")

    messages = [SystemMessage(content=system_prompt)]

    for msg in history:
        if msg.message_role == "user":
            messages.append(HumanMessage(content=msg.message_text))
        else:
            messages.append(AIMessage(content=msg.message_text))

    # messages.append(HumanMessage(content=user_message))

    response = llm.invoke(messages)

    return response.content