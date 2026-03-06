# Wren Gateway SDK

Python SDK for Wren AI Security Gateway.

## Installation

pip install wren-gateway

## Usage

from wren_gateway import WrenClient

client = WrenClient(
    base_url="http://localhost:8000",
    api_key="your-key"
)

client.simple_chat("hello")