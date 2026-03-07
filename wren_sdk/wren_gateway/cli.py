import json
import sys
import requests
from getpass import getpass
from rich.console import Console
from rich.prompt import Prompt

console = Console()


def print_banner():
    console.print("""
############################################################
#                                                          #
#   ██╗    ██╗██████╗ ███████╗███╗   ██╗                   #
#   ██║    ██║██╔══██╗██╔════╝████╗  ██║                   #
#   ██║ █╗ ██║██████╔╝█████╗  ██╔██╗ ██║                   #
#   ██║███╗██║██╔══██╗██╔══╝  ██║╚██╗██║                   #
#   ╚███╔███╔╝██║  ██║███████╗██║ ╚████║                   #
#    ╚══╝╚══╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝                   #
#                                                          #
#                Team Carrick_Ball                         #
#                                                          #
############################################################
""", style="bold orange1")


def validate_key(api_key, gateway):
    try:
        r = requests.post(
            f"{gateway}/v1/chat/completions",
            headers={
                "Content-Type": "application/json",
                "X-Wren-Key": api_key
            },
            json={
                "model": "mock",
                "messages": [{"role": "user", "content": "ping"}]
            },
            timeout=5
        )

        return r.status_code == 200
    except Exception:
        return False


def init():
    console.print("\n[orange1]Secure your AI application in minutes.[/orange1]\n")

    console.print("[bold]Which LLM provider are you using?[/bold]")
    console.print("1) OpenAI")
    console.print("2) Ollama (local models)")
    console.print("3) Anthropic")
    console.print("4) Other OpenAI-compatible")

    provider_choice = Prompt.ask("Select option", choices=["1", "2", "3", "4"], default="1")

    provider_map = {
        "1": "openai",
        "2": "ollama",
        "3": "anthropic",
        "4": "custom"
    }

    provider = provider_map[provider_choice]

    console.print("\n[bold]Select model[/bold]")

    if provider == "openai":
        console.print("1) gpt-4o-mini (recommended)")
        console.print("2) gpt-4o")
        console.print("3) custom")

        model_choice = Prompt.ask("Choice", choices=["1", "2", "3"], default="1")

        if model_choice == "1":
            model = "gpt-4o-mini"
        elif model_choice == "2":
            model = "gpt-4o"
        else:
            model = Prompt.ask("Enter model name")
    else:
        model = Prompt.ask("Enter model name")

    console.print("\n[bold]Where is your Wren gateway running?[/bold]")
    console.print("1) Local machine")
    console.print("2) Remote server")

    gateway_choice = Prompt.ask("Choice", choices=["1", "2"], default="1")

    if gateway_choice == "1":
        gateway = "http://localhost:8000"
    else:
        gateway = Prompt.ask("Enter gateway URL")

    if not gateway.startswith("http"):
        gateway = "http://" + gateway

    console.print("\n[bold]Enter your Wren API key[/bold]")
    api_key = getpass("API Key: ")

    console.print("[orange1]Validating key...[/orange1]")

    if not validate_key(api_key, gateway):
        console.print("[bold red]Invalid API key or gateway unreachable[/bold red]")
        return

    console.print("[bold green]API key verified[/bold green]")

    with open(".env", "w") as f:
        f.write(f"WREN_API_KEY={api_key}\n")
        f.write(f"WREN_BASE_URL={gateway}\n")

    config = {
        "provider": provider,
        "model": model,
        "wren_gateway": gateway
    }

    with open("wren.config.json", "w") as f:
        json.dump(config, f, indent=2)

    console.print("\n[bold green]Wren configured successfully.[/bold green]\n")

    console.print("[orange1]Configuration[/orange1]")
    console.print(f"Provider: {provider}")
    console.print(f"Model: {model}")
    console.print(f"Gateway: {gateway}")

    console.print("\nFiles created:")
    console.print("  .env")
    console.print("  wren.config.json")


def main():
    print_banner()

    if len(sys.argv) == 1:
        init()
        return

    command = sys.argv[1]

    if command == "init":
        init()
    else:
        console.print(f"[red]Unknown command:[/red] {command}")
        console.print("Available commands: init")