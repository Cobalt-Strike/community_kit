# Security Research Environment Setup

## Video Walkthrough

<center>
    <video width="720" heigth="480" crossorigin="anonymous" aria-label="Security Research Environment Setup Video Walkthrough" x-webkit-airplay="allow" playsinline="" controls controlslist="nodownload">
    <source src="https://embed-ssl.wistia.com/deliveries/da77a2884c07f030cde3280947a82d090526f1f6/9fpmwjill3.mp4" type="video/mp4">
    </video>
</center>

## Install Requirements

### Prerequisites

- A **Windows 11** machine (without a security solution)
- [Python 3](https://www.python.org/downloads/)
- [Git](https://git-scm.com/downloads/win)
- [Wireshark](https://www.wireshark.org/)

### Visual Studio Installation

1. Download [Visual Studio Community/Pro/Enterprise 2022](https://visualstudio.microsoft.com/downloads/).

2. During installation, **select the workloads**:

    - Desktop Development with C++
    - [Optional] Linux Development with C++

3. **Install and restart** if prompted

### Install Windows Terminal

1. Open the Microsoft Store: Press ```Win + S``` and type ```Microsoft Store```, then open it.
2. Search for "Windows Terminal".
3. Select **"Windows Terminal"** (by Microsoft Corporation) and click ```Install```.
4. You are all set. Search for "Windows Terminal" in the Start Menu and pin it to your taskbar for quick access.

### Install WSL and Ubuntu

1. Open the **Windows Terminal** and type:

    ```powershell
    wsl --install
    ```

2. Install **Ubuntu**:

    ```powershell
    wsl --set-default-version 2
    wsl --install -d Ubuntu
    ```

3. After reboot, open Ubuntu from the Start menu and let it finish setup.

4. Open Ubuntu and update the Operating System:

    ```bash
    sudo apt update && sudo apt upgrade -y
    ```

5. Install Required packages

    ```bash
    sudo apt install curl tar openssl python3 python3-venv python3-pip openjdk-17-jdk mingw-w64 clang llvm make [...]
    ```

### Access Files from Windows to WSL (and viceversa)

Use the special path ```/mnt/c``` to access your Windows filesystem from WSL.

Example:
```bash
cd /mnt/c/Users/<YourUser>/source/
```

Or access WSL filesystem from Windows:

```
\\wsl$\Ubuntu\home\<username>\
```

### Update Windows Defender Settings

> [!IMPORTANT]
> For any Windows target used with Cobalt Strike, it is important to turn off Cloud-delivered protection and Automatic sample submission.  This is so we do not inadvertently submit latest dev artifacts for analysis.

#### Temporarily Disable Windows Defender

1. Open the Windows Defender settings: Press ```Win + S``` and click ```Windows Security```.
2. In the sidebar, click **"Virus & threat protection"**
3. Click **Virus & threat protection settings**, click: **Manage settings**
4. Disable Cloud-delivered Protection: In the Virus & threat protection settings page, find **Cloud-delivered protection** and Toggle **Off**
5. Disable Automatic Sample Submission: In the same settings page, scroll down to **Automatic sample submission** and Toggle **Off**

#### Permanently Disable Windows Defender

With the latest builds of Windows, you can toggle Real-time protection to off, but this is only a temporary fix and Windows will re-enable Defender after a short time.  Follow the steps below to permanently disable Defender.

1. Follow the steps provided in the previous section [Temporarily Disable Windows Defender](#temporarily-disable-windows-defender)
2. Disable Tamper Protection: Scroll down to **Tamper Protection** and Toggle **Off**.
3. Open the Registry: Press ```Win + S``` and click: ```Registry Editor```.
4. Browse to: ```Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows Defender``` and add the following **DWORDS**:

    |Name|Type|Data|
    |----------------|---------|--------------|
    |DisableAntiVirus|REG_DWORD|0x00000001 (1)|
    |DisableRealtimeMonitoring|REG_DWORD|0x00000001 (1)|
    |DisableRoutinelyTakingAction|REG_DWORD|0x00000001 (1)|
    |DisableSpecialRunningModes|REG_DWORD|0x00000001 (1)|
    |ServiceKeepAlive|REG_DWORD|0x00000001 (1)|

5. Create the Following **Keys**:

    - Policy Manager
    - Real-Time Protection
    - Signature Updates
    - Spynet

6. Browse to: ```Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows Defender\Real-Time Protection``` and add the following **DWORDS**:

    |Name|Type|Data|
    |----------------|---------|--------------|
    |DisableBehaviorMonitoring|REG_DWORD|0x00000001 (1)|
    |DisableOnAccessProtection|REG_DWORD|0x00000001 (1)|
    |DisableRealtimeMonitoring|REG_DWORD|0x00000001 (1)|
    |DisableScanOnRealtimeEnable|REG_DWORD|0x00000001 (1)|

7. Browse to: ```Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows Defender\Signature Updates``` and add the following **DWORDS**:

    |Name|Type|Data|
    |----------------|---------|--------------|
    |ForceUpdateFromMU|REG_DWORD|0x00000001 (1)|

8. Browse to: ```Computer\HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows Defender\Spynet``` and add the following **DWORDS**:

    |Name|Type|Data|
    |----------------|---------|--------------|
    |DisableBlockAtFirstSeen|REG_DWORD|0x00000001 (1)|

9. Reboot Windows

<details>

<summary>The steps from 3 to 9, can be automated with the following Powershell Script</summary>


```powershell
# Must be run as Administrator
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(`
    [Security.Principal.WindowsBuiltInRole] "Administrator"))
{
    Write-Host "You must run this script as Administrator!" -ForegroundColor Red
    exit 1
}

# Disable real-time protection and cloud settings (requires Defender cmdlets)
Write-Host "[*] Disabling Defender features..." -ForegroundColor Yellow
Set-MpPreference -DisableRealtimeMonitoring $true
Set-MpPreference -SubmitSamplesConsent 2      # Never send
Set-MpPreference -MAPSReporting 0             # Disable cloud protection

# Registry base path
$base = "HKLM:\SOFTWARE\Policies\Microsoft\Windows Defender"

# Create required keys
$keys = @(
    "$base",
    "$base\Policy Manager",
    "$base\Real-Time Protection",
    "$base\Signature Updates",
    "$base\Spynet"
)

foreach ($key in $keys) {
    if (-not (Test-Path $key)) {
        New-Item -Path $key -Force | Out-Null
        Write-Host "Created key: $key"
    }
}

# Add DWORD values
$regValues = @{
    "$base" = @{
        "DisableAntiVirus" = 1
        "DisableRealtimeMonitoring" = 1
        "DisableRoutinelyTakingAction" = 1
        "DisableSpecialRunningModes" = 1
        "ServiceKeepAlive" = 1
    }
    "$base\Real-Time Protection" = @{
        "DisableBehaviorMonitoring" = 1
        "DisableOnAccessProtection" = 1
        "DisableRealtimeMonitoring" = 1
        "DisableScanOnRealtimeEnable" = 1
    }
    "$base\Signature Updates" = @{
        "ForceUpdateFromMU" = 1
    }
    "$base\Spynet" = @{
        "DisableBlockAtFirstSeen" = 1
    }
}

foreach ($path in $regValues.Keys) {
    foreach ($name in $regValues[$path].Keys) {
        New-ItemProperty -Path $path -Name $name -Value $regValues[$path][$name] -PropertyType DWORD -Force | Out-Null
        Write-Host "Set $name = $($regValues[$path][$name]) in $path"
    }
}

Write-Host "`n[!] Tamper Protection must be disabled manually via GUI:"
Write-Host "    Windows Security > Virus & threat protection > Manage settings > Tamper Protection [Off]"
Write-Host "    Or use MDM/Intune for managed devices" -ForegroundColor Cyan

# Optional: pause to allow user to read
Start-Sleep -Seconds 2

# Prompt for reboot
$choice = Read-Host "`nDo you want to reboot now? (Y/N)"
if ($choice -match '^[Yy]$') {
    Restart-Computer
} else {
    Write-Host "Reboot skipped. Please restart manually for changes to take full effect." -ForegroundColor Yellow
}

```
</details>

## Install Cobalt Strike

### Install the Cobalt Strike Teamserver inside Ubuntu

> [!IMPORTANT]
> Make sure the [requirements](https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/install_byb.htm) are met.


1. Download Cobalt Strike for Linux from https://www.cobaltstrike.com/download


2. Install [Cobalt Strike](https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/install_installing.htm)

3. Ensure you can run the Team Server from WSL. This is useful for BOF testing, scripting, or C2 Comms debugging.

    ```bash
    ./teamserver <ip> <password>
    ```

### Install the Cobalt Strike Client in the Windows machine

1. Download Cobalt Strike for Windows from https://www.cobaltstrike.com/download.
2. Navigate to the ```📁 cobaltstrike > client folder```.
3. Double-click ```cobaltstrike.exe```.
4. Connect to the Team Server.

## Folders Structure

```
📁 Users
└── 📁 <your user>
    └── 📁 source
        ├── 📁 CS_ArsenalKit
        ├── 📁 CS_OfficialRepos
        ├── 📁 CS_CommunityKit
        └── 📁 CS_Research
```

|Contents|Windows Path|WSL Path|
|-----|------|-----|
|[Arsenal Kit](https://www.cobaltstrike.com/scripts) source code and usage examples|C:\Users\<YourUser>\source\CS_ArsenalKit|/mnt/c/Users/\<YourUser>/source/CS_ArsenalKit|
|Official Cobalt Strike repositories cloned from [GitHub](https://github.com/Cobalt-Strike)|C:\Users\<YourUser>\source\CS_OfficialRepos|/mnt/c/Users/\<YourUser>/source/CS_OfficialRepos|
|[Community-developed](https://cobalt-strike.github.io/community_kit/) tools, scripts, and examples|C:\Users\<YourUser>\source\CS_CommunityKit|/mnt/c/Users/\<YourUser>/source/CS_CommunityKit|
|Your own research projects, BOFs, profiles, and scripts|C:\Users\<YourUser>\source\CS_Research|/mnt/c/Users/\<YourUser>/source/CS_Research|

## Get Cobalt Strike Development Kits

### Initial Access / Stage 0 templates:

- [Artifact Kit](https://www.cobaltstrike.com/scripts)
- [Ressource Kit](https://www.cobaltstrike.com/scripts)

### Load-Time Evasion templates:

- [UDRL-VS](https://github.com/Cobalt-Strike/UDRL-VS)

### Run-Time Evasion templates:
    
- [Sleepmask-VS](https://github.com/Cobalt-Strike/sleepmask-vs)
- [Mutator Kit](https://www.cobaltstrike.com/scripts)

### Post-Exploitation

- [BOF-VS](https://github.com/Cobalt-Strike/bof-vs)
- [Process Inject Kit](https://github.com/Cobalt-Strike/process-inject)
- [Post-Ex UDRL](https://www.cobaltstrike.com/scripts)
- [Post-Ex Kit](https://www.cobaltstrike.com/scripts)

### Network Communications

- [UDC2-VS](https://github.com/Cobalt-Strike/UDC2-VS)


## Tips & Tricks

- 💡 To edit [Aggressor Scripts](https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics_aggressor-scripts/agressor_script.htm), use the **Perl** syntax highlighter.