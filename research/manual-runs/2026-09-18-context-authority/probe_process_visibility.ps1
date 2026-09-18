$ErrorActionPreference = "Stop"
$token = "SYNTHETIC-RUN-TOKEN-9f4c2a"
$worker = Join-Path $PSScriptRoot "process_visibility_worker.py"
$python = (Get-Command python).Source
$rows = @()

function Inspect-Case {
    param([string]$Mode)
    $psi = [System.Diagnostics.ProcessStartInfo]::new()
    $psi.FileName = $python
    $psi.UseShellExecute = $false
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardInput = $true
    $psi.ArgumentList.Add($worker)
    $psi.ArgumentList.Add("--mode")
    $psi.ArgumentList.Add($Mode)
    if ($Mode -eq "argv") { $psi.ArgumentList.Add("--token"); $psi.ArgumentList.Add($token) }
    if ($Mode -eq "env") { $psi.Environment["SYNTHETIC_RUN_TOKEN"] = $token }
    $proc = [System.Diagnostics.Process]::Start($psi)
    if ($Mode -eq "stdin") { $proc.StandardInput.WriteLine($token); $proc.StandardInput.Flush() }
    $ready = $proc.StandardOutput.ReadLine()
    $line = (Get-CimInstance Win32_Process -Filter "ProcessId = $($proc.Id)").CommandLine
    $script:rows += [ordered]@{ mode = $Mode; child_ready = $ready; synthetic_token_visible_in_command_line = $line.Contains($token) }
    $proc.Kill(); $proc.WaitForExit()
}

Inspect-Case "argv"
Inspect-Case "env"
Inspect-Case "stdin"
[ordered]@{
    schema = "process-argument-visibility-probe/v1"
    platform = [System.Environment]::OSVersion.VersionString
    observer = "Win32_Process.CommandLine under the same Windows account"
    cases = $rows
    boundary = "Synthetic token only; command-line visibility only; not a Linux /proc reproduction."
} | ConvertTo-Json -Depth 5

