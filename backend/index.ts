import express from "express";
import { tavily } from '@tavily/core';
import { streamText } from 'ai';
import { SYSTEM_PROMPT, PROMPT_TEMPLATE } from "./prompt";

const client = tavily({ apiKey: process.env.TAVILY_API_KEY }); //Initialize tavily for web search resuilts
const app = express();

app.use(express.json()); //Parse incoming JSON body requests

app.post("/lucidly_ask", async (req, res) => {
    //Step 1 - get the query from the user
    const query = req.body.query;

    //Step 2 - make sure the user has access/credits to hit the endpoint

    //Step 3 (TODO) - check if we have web search indexed for a similar query

    //Step 4- web search to gather resources (external web crawler endpoint)
    const webSearchRespose = await client.search(query, {
        searchDepth: "advanced"
    })
    const webSearchResult = webSearchRespose.results;

    //Step 5 - do some context engineering on the promt + web search responses
    const prompt = PROMPT_TEMPLATE
        .replace("{{WEB_SEARCH_RESULTS}}", JSON.stringify(webSearchResult))
        .replace("{{USER_QUERY}}", query);

    //Step 6 - hit the LLM and steam back the response to the user
    const result = streamText({
        model: 'openai/gpt-5.4',
        prompt: prompt,
        system: SYSTEM_PROMPT
    });
    //Step 7 - also stream back the sources andthe follow up questions (which we can get from  another parallel LLM call)

    //Step 8 - close the event stream
})

app.listen(3000);
