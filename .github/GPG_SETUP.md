# GPG Setup for Commit Signing

This guide helps you set up GPG commit signing for enhanced security.

## Prerequisites

- Git installed
- GPG installed (comes with Git on most systems)
- GitHub account

## Step 1: Generate GPG Key

```bash
# Generate a new GPG key
gpg --full-generate-key

# Choose:
# - RSA and RSA (default)
# - 4096 bits
# - Key does not expire (0)
# - Your real name
# - Your GitHub email address
# - A secure passphrase
```

## Step 2: List and Export GPG Key

```bash
# List your GPG keys
gpg --list-secret-keys --keyid-format=long

# Export your public key (replace KEY_ID with your actual key ID)
gpg --armor --export KEY_ID
```

## Step 3: Add GPG Key to GitHub

1. Copy the GPG key output (including `-----BEGIN PGP PUBLIC KEY BLOCK-----` and `-----END PGP PUBLIC KEY BLOCK-----`)
2. Go to GitHub → Settings → SSH and GPG keys
3. Click "New GPG key"
4. Paste your key and save

## Step 4: Configure Git

```bash
# Set your GPG key for Git (replace KEY_ID with your actual key ID)
git config --global user.signingkey KEY_ID

# Enable GPG signing for all commits
git config --global commit.gpgsign true

# Set your name and email (must match GPG key)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Configure commit message template
git config --global commit.template .gitmessage
```

## Step 5: Test Signing

```bash
# Make a test commit
echo "test" > test.txt
git add test.txt
git commit -m "test: GPG signing test"

# Verify the commit is signed
git log --show-signature -1
```

## Troubleshooting

### GPG Agent Issues

```bash
# If GPG agent is not working
export GPG_TTY=$(tty)
echo 'export GPG_TTY=$(tty)' >> ~/.bashrc

# Or for zsh
echo 'export GPG_TTY=$(tty)' >> ~/.zshrc
```

### Passphrase Caching

```bash
# Configure GPG agent for passphrase caching
echo "default-cache-ttl 28800" >> ~/.gnupg/gpg-agent.conf
echo "max-cache-ttl 86400" >> ~/.gnupg/gpg-agent.conf
gpg-connect-agent reloadagent /bye
```

### VS Code Integration

Add to VS Code settings:

```json
{
  "git.enableCommitSigning": true
}
```

## Security Best Practices

1. **Keep your private key secure**: Never share your private GPG key
2. **Use a strong passphrase**: Protect your key with a complex passphrase
3. **Backup your key**: Store a secure backup of your GPG key
4. **Revoke if compromised**: If your key is compromised, revoke it immediately
5. **Regular key rotation**: Consider rotating keys periodically

## Key Management

### Backup Your Key

```bash
# Export private key (keep this secure!)
gpg --armor --export-secret-keys KEY_ID > private-key.asc

# Export public key
gpg --armor --export KEY_ID > public-key.asc

# Export trust database
gpg --export-ownertrust > trust-db.txt
```

### Restore Key on New Machine

```bash
# Import private key
gpg --import private-key.asc

# Import public key
gpg --import public-key.asc

# Restore trust
gpg --import-ownertrust trust-db.txt

# Set ultimate trust on your key
gpg --edit-key KEY_ID
# Type: trust
# Choose: 5 (ultimate)
# Type: quit
```

## Verification

Once set up, all your commits will be signed and show a "Verified" badge on GitHub. You can verify locally with:

```bash
git log --show-signature
```

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your GPG key is correctly added to GitHub
3. Ensure your Git email matches your GPG key email
4. Check that GPG agent is running properly
