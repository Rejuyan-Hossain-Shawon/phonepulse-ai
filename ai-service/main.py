"""Optional local transformer inference service; downloads model weights on first run.
The Node backend currently uses its transparent rule-based baseline; integration is an extension task.
"""
from fastapi import FastAPI
from pydantic import BaseModel, Field
from functools import lru_cache
app=FastAPI(title='PhonePulse NLP Service')
class TextIn(BaseModel):
    text:str=Field(min_length=3,max_length=4000)
@lru_cache(maxsize=1)
def model():
    from transformers import pipeline
    return pipeline('text-classification',model='cardiffnlp/twitter-roberta-base-sentiment-latest')
@app.get('/health')
def health():return {'status':'ok','model_loaded':model.cache_info().currsize>0}
@app.post('/predict')
def predict(x:TextIn):
    result=model()(x.text,truncation=True,max_length=512)[0]
    return {'sentiment':result['label'].lower(),'confidence':result['score'],'method':'twitter-roberta-base-sentiment-latest'}
