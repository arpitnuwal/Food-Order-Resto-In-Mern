import os
import subprocess
from datetime import datetime

def get_positive_int(prompt, default=20):
    while True:
        try:
            user_input = input(f"{prompt} (default {default}): ")
            if not user_input.strip():
                return default
            value = int(user_input)
            if value > 0:
                return value
            else:
                print("Please enter a positive integer.")
        except ValueError:
            print("Invalid input. Please enter a valid integer.")

def get_repo_path(prompt, default="."):
    while True:
        user_input = input(f"{prompt} (default current directory): ")
        if not user_input.strip():
            return default
        if os.path.isdir(user_input):
            return user_input
        else:
            print("Directory does not exist. Please enter a valid path.")

def get_filename(prompt, default="data.txt"):
    user_input = input(f"{prompt} (default {default}): ")
    if not user_input.strip():
        return default
    return user_input

def make_commit(repo_path, filename, message="daily commit"):
    filepath = os.path.join(repo_path, filename)

    # File me update karo
    with open(filepath, "a") as f:
        f.write(f"Commit at {datetime.now().isoformat()}\n")

    # Git add & commit
    subprocess.run(["git", "add", filename], cwd=repo_path)
    subprocess.run(["git", "commit", "-m", message], cwd=repo_path)

def main():
    print("="*60)
    print("🌱 GitHub Current Contribution Generator 🌱")
    print("="*60)

    num_commits = get_positive_int("How many commits do you want to make", 20)
    repo_path = get_repo_path("Enter the path to your local git repository", ".")
    filename = get_filename("Enter the filename to modify for commits", "data.txt")

    print(f"\nMaking {num_commits} commits for TODAY in repo: {repo_path}\n")

    for i in range(num_commits):
        print(f"[{i+1}/{num_commits}] Committing now...")
        make_commit(repo_path, filename)

    print("\nPushing commits to your remote repository...")
    subprocess.run(["git", "push"], cwd=repo_path)

    print("✅ Done! Aaj ka GitHub contribution green ho jayega 😄")

if __name__ == "__main__":
    main()