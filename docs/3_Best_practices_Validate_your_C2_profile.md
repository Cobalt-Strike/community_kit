# Validate your C2 profile

Before deploying a Malleable C2 profile in a live operation, it's essential to thoroughly validate and test it. A misconfigured or malformed profile can cause Beacons to fail to check in or silently drop task output—potentially compromising your entire engagement.

> [!IMPORTANT]
>**Always test new profiles in a controlled environment to ensure stability and correct behavior.**

## C2lint

Cobalt Strike's Linux package includes ```c2lint```, a utility for validating Malleable C2 profiles. It performs:

- ✅ Syntax validation
- ✅ Logical consistency checks
- ✅ Unit testing with randomized inputs

This tool helps catch common mistakes and misconfigurations early—**before** they break your infrastructure.

### Basic Usage:

```bash
./c2lint <path to my profile>
```

If the profile passes all checks, you’ll receive a confirmation message. Otherwise, ```c2lint``` will report [warnings or errors](https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/malleable-c2_checking-errors.htm) that should be addressed before loading the profile into Cobalt Strike.

### Sample c2lint Output

<pre><code>
[*] Starting c2lint

===============
default
===============

http-get
--------

[...]

<span style="color:#16C60C;">[+]</span> POST 3x check passed
<span style="color:#16C60C;">[+]</span> .http-get.server.output size is good
<span style="color:#16C60C;">[+]</span> .http-get.client size is good
<span style="color:#16C60C;">[+]</span> .http-post.client size is good
<span style="color:#16C60C;">[+]</span> .http-get.client.metadata transform+mangle+recover passed (1 byte[s])
<span style="color:#16C60C;">[+]</span> .http-get.client.metadata transform+mangle+recover passed (100 byte[s])
<span style="color:#16C60C;">[+]</span> .http-get.client.metadata transform+mangle+recover passed (128 byte[s])
<span style="color:#16C60C;">[+]</span> .http-get.client.metadata transform+mangle+recover passed (256 byte[s])
<span style="color:#16C60C;">[+]</span> .http-get.server.output transform+mangle+recover passed (0 byte[s])
<span style="color:#16C60C;">[+]</span> .http-get.server.output transform+mangle+recover passed (1 byte[s])
<span style="color:#16C60C;">[+]</span> .http-get.server.output transform+mangle+recover passed (48248 byte[s])
<span style="color:#16C60C;">[+]</span> .http-get.server.output transform+mangle+recover passed (1048576 byte[s])
<span style="color:#16C60C;">[+]</span> .http-post.client.id transform+mangle+recover passed (4 byte[s])
<span style="color:#16C60C;">[+]</span> .http-post.client.output transform+mangle+recover passed (0 byte[s])
<span style="color:#16C60C;">[+]</span> .http-post.client.output transform+mangle+recover passed (1 byte[s])
<span style="color:#16C60C;">[+]</span> .http-post.client.output POSTs results
<span style="color:#16C60C;">[+]</span> .http-post.client.output transform+mangle+recover passed (48248 byte[s])
<span style="color:#16C60C;">[+]</span> .http-post.client.output transform+mangle+recover passed (1048576 byte[s])
<span style="color:#C19C00;">[%]</span> [OPSEC] .host_stage is true. Your Beacon payload is available to anyone that connects to your server to request it. Are you OK with this?
<span style="color:#F9F1A5;">[!]</span> .code-signer.keystore is missing. Will not sign executables and DLLs
<span style="color:#16C60C;">[+]</span> SSL certificate generation OK
<span style="color:#3B78FF;">[*]</span> Checking beacon WININET dlls...
<span style="color:#3B78FF;">[*]</span> Checking beacon WINHTTP dlls...
<span style="color:#F9F1A5;">[!]</span> .stage.smartinject is ignored when .stage.rdll_loader is set to PrependLoader
<span style="color:#F9F1A5;">[!]</span> Detected 2 warnings.
</code></pre>

## Additional Verifications

In addition to running ```c2lint```, it's critical to manually test the profile by validating all major Beacon functionalities in a controlled environment.

### Quick steps for manual validation

1. Start [Wireshark](https://www.wireshark.org/) on your test system to monitor C2 traffic.
2. Start a Cobalt Strike team server with your test profile

    ```text
    ./teamserver <ip> <password> <path to your test profile>
    ```
3. Create Listeners matching the configurations of your profile
    - HTTP Listener (named ```HTTP```)
    - HTTPS Listener (named ```HTTPS```)
    - DNS Listener (named ```DNS```)
    - DNS over HTTPS Listener (named ```DoH```)
    - SMB Listener (named ```SMB```)

4. Create a Scripted Web Delivery attack to stage the HTTP Beacon
    - Go to Attacks → Web Drive-by → Scripted Web Delivery
    - Choose PowerShell payload using the HTTP listener
    - Run the PowerShell on a test Windows system as an **Administrator**
    - Double-click on the elevated beacon to open the console
    - Spawn new Beacons and test communications. Run each of the following from the active Beacon:
        - ```spawn x64 HTTP```
        - ```spawn x86 HTTP```
        - ```spawn x64 SMB```
        - ```spawn x86 SMB```
        - ```[...]```

5. Review captured traffic and confirm the behavior matches expectations:
    - Staging process (initial contact and payload delivery)
    - ```http-get``` communication (Beacon check-ins)
    - ```http-post``` communication (task output return)

6. Test key Beacon commands:
    - ```ps```
    - ```ls```
    - ```download path/to/testfile.txt```
    - ```upload path/to/testfile.txt```


> [!IMPORTANT]
> **These steps help ensure your profile does not interfere with core Beacon capabilities or communication reliability.**

[Read More...](https://hstechdocs.helpsystems.com/manuals/cobaltstrike/current/userguide/content/topics/malleable-c2_main.htm)

## References

- [A Deep Dive into Cobalt Strike Malleable C2](https://posts.specterops.io/a-deep-dive-into-cobalt-strike-malleable-c2-6660e33b0e0b)

