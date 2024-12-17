# Save current work on the feature branch
# Stage and commit any work in progress (WIP)
git add .  # Stage all changes
git commit -m "WIP: Progress on [feature-name]"  # Commit the work in progress

# If changes are incomplete and you don’t want to commit, stash them
git stash save "WIP: Progress on [feature-name]"  # Save uncommitted work to stash

# Switch to the main branch
git checkout main  # Switch to main branch
git pull origin main  # Ensure main branch is up-to-date

# Create a new branch for the bug fix
git checkout -b bugfix/[description-of-bug]  # Create and switch to bug fix branch

# Work on the bug fix and commit changes
git add .  # Stage bug fix changes
git commit -m "Fix: Resolved [describe bug]"  # Commit the bug fix

# Push the bug fix branch to the remote repository
git push origin bugfix/[description-of-bug]  # Push bug fix branch to GitHub

# (Optional) Create a Pull Request on GitHub for merging the bug fix into main

# Merge the bug fix branch into main
git checkout main  # Switch to the main branch
git pull origin main  # Ensure local main is up-to-date
git merge bugfix/[description-of-bug]  # Merge the bug fix into main

# Push the updated main branch to GitHub
git push origin main  # Push the updated main to GitHub

# Delete the bug fix branch after merging
git branch -d bugfix/[description-of-bug]  # Delete the branch locally
git push origin --delete bugfix/[description-of-bug]  # Delete the branch remotely

# Return to your feature branch
git checkout feature/[feature-name]  # Switch back to the feature branch

# Incorporate the latest changes from main into your feature branch
git pull origin main  # Merge the latest changes from main into your feature branch

# Restore stashed changes (if applicable)
git stash pop  # Apply stashed changes and remove them from the stash

# ==========================
# Create a new branch from a branch (not main)
# ==========================

# Switch to the source branch (not main)
git checkout [source-branch]  # Replace [source-branch] with the branch name

git pull origin [source-branch]  # Sync the source branch with its remote

# Create and switch to the new branch
git checkout -b [new-branch-name]  # Replace [new-branch-name] with the new branch name

# Push the new branch to the remote repository
git push -u origin [new-branch-name]  # Set the upstream branch on GitHub

# ==========================
# Merge code from one branch to another (not main)
# ==========================

# Switch to the target branch (the branch to receive changes)
git checkout [target-branch]  # Replace [target-branch] with the branch name

git pull origin [target-branch]  # Ensure the target branch is up-to-date

# Merge the source branch into the target branch
git merge [source-branch]  # Replace [source-branch] with the branch name

# Resolve merge conflicts if necessary
# - Open files with conflicts and manually resolve them
# - Mark them as resolved:
git add [conflicted-file]  # Stage resolved files

git commit  # Finalize the merge

# Push the updated target branch to the remote repository
git push origin [target-branch]  # Push the changes

# ==========================
# Handle untracked files
# ==========================

# Check the status of untracked files
git status  # Lists all untracked files

# Add untracked files to the current branch
git add [file1.txt] [file2.txt]  # Stage specific untracked files
git commit -m "Add untracked files"  # Commit them to the branch

# If untracked files are temporary and should be ignored, add them to .gitignore
echo "temp/" >> .gitignore  # Example: Ignore all files in the temp directory
echo "*.log" >> .gitignore  # Example: Ignore all log files
git add .gitignore  # Stage the updated .gitignore
git commit -m "Update .gitignore to exclude untracked files"

# ==========================
# Stashing and restoring changes
# ==========================

# Stash uncommitted changes
git stash save "WIP: [description]"  # Save work in progress

# List all stashes
git stash list  # View all stashes with descriptions

# Apply the latest stash and remove it from the stash list
git stash pop  # Restore the latest stash

# Apply a specific stash without removing it
git stash apply stash@{0}  # Replace stash@{0} with the stash you want

# Drop a specific stash (if no longer needed)
git stash drop stash@{0}  # Remove a specific stash
