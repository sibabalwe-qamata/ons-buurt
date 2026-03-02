# Refresh PATH so Doppler CLI is found (needed after first install)
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Run Doppler login
doppler login
