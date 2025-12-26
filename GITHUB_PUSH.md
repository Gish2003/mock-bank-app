# GitHub Push Instructions

Follow these steps to push your code to GitHub:

## Step 1: Navigate to Project Directory

```bash
cd mock-banking-app
```

## Step 2: Initialize Git Repository

```bash
git init
```

## Step 3: Add All Files

```bash
git add .
```

## Step 4: Create Initial Commit

```bash
git commit -m "Initial commit: Mock banking application backend"
```

## Step 5: Add Remote Repository

Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/mock-banking-app.git
```

Or use the exact URL you copied from GitHub when creating the repository.

## Step 6: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

## If You Get Authentication Error

GitHub requires a Personal Access Token (PAT) instead of password:

1. Go to GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Banking App"
4. Select scopes: `repo` (full control of private repositories)
5. Generate token and **COPY IT IMMEDIATELY** (you won't see it again)
6. When pushing, use the token as your password

---

## Quick Commands Summary

```bash
# Navigate to project
cd mock-banking-app

# Initialize git
git init

# Add files
git add .

# Commit
git commit -m "Initial commit: Mock banking application backend"

# Add remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/mock-banking-app.git

# Push
git branch -M main
git push -u origin main
```

---

## Verify on GitHub

After pushing, visit your repository on GitHub:
`https://github.com/YOUR_USERNAME/mock-banking-app`

You should see all your files there!

---

## Future Updates

After making changes to code:

```bash
git add .
git commit -m "Description of changes"
git push
```
