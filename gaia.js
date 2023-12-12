// ==UserScript==
// @name         Google PeopleStack Autocomplete Service Request
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Make a request to Google's PeopleStack Autocomplete Service and extract a specific number from the response using regex
// @author       Robot
// @match        https://*peoplestack-pa.clients6.google.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // Define your authorization and x-goog-api-key values here
    const authorization = "SAPISIDHASH 123456";
    const xGoogApiKey = "123456";

    // Function to extract the number using regex
    function extractNumber(responseText) {
        const numberRegex = /"(\d+)"/;
        const match = responseText.match(numberRegex);
        return match && match[1];
    }

    // Create a container div for the user interface
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.margin = '20px';

    // Create an input box for email
    const emailInput = document.createElement('input');
    emailInput.type = 'text';
    emailInput.placeholder = 'Enter email address';
    container.appendChild(emailInput);

    // Create a button to send the request
    const sendButton = document.createElement('button');
    sendButton.textContent = 'Send Request';
    sendButton.style.marginTop = '10px';
    container.appendChild(sendButton);

    // Create an output box for the number
    const outputBox = document.createElement('div');
    outputBox.style.marginTop = '10px';
    container.appendChild(outputBox);

    // Append the container to the body
    document.body.appendChild(container);

    // Add a click event listener to the send button
    sendButton.addEventListener('click', function() {
        const email = emailInput.value.trim();

        if (email) {
            // URL of the service
            const url = "https://peoplestack-pa.clients6.google.com/$rpc/peoplestack.PeopleStackAutocompleteService/Lookup";

            // Data
            const data = JSON.stringify([58, [1], [[email]]]);

            // Make the request
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                headers: {
                    "authorization": authorization,
                    "x-goog-api-key": xGoogApiKey,
                    "Content-Type": "application/json+protobuf",
                    "authority": "peoplestack-pa.clients6.google.com",
                    "accept": "*/*",
                    "accept-language": "en-US,en;q=0.5",
                    "content-type": "application/json+protobuf",
                    "origin": "https://docs.google.com",
                    "referer": "https://docs.google.com/",
                    "sec-ch-ua": '"Brave";v="119", "Chromium";v="119", "Not?A_Brand";v="24"',
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": '"Windows"',
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "sec-gpc": "1",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
                    "x-goog-authuser": "0",
                    "x-user-agent": "grpc-web-javascript/0.1",
                },
                data: data,
                onload: function(response) {
                    if (response.status === 200) {
                        // If the response status is 200 OK, proceed to extract the number using regex
                        try {
                            const jsonResponse = JSON.parse(response.responseText);
                            console.log("Full Response:", jsonResponse); // Log the full response for inspection

                            // Extract the number using regex
                            const extractedNumber = extractNumber(response.responseText);

                            if (extractedNumber) {
                                console.log("Extracted Number:", extractedNumber);
                                outputBox.textContent = `Extracted Number: ${extractedNumber}`;
                            } else {
                                console.error("Unable to extract the number from the response.");
                                outputBox.textContent = 'Unable to extract the number.';
                            }
                        } catch (error) {
                            console.error("Error parsing response:", error);
                            outputBox.textContent = 'Error parsing response.';
                        }
                    } else {
                        console.error("Request failed with status code:", response.status);
                        outputBox.textContent = 'Request failed with status code.';
                    }
                },
                onerror: function(error) {
                    console.error("Request failed", error);
                    outputBox.textContent = 'Request failed.';
                }
            });
        } else {
            outputBox.textContent = 'Please enter an email address.';
        }
    });
})();
