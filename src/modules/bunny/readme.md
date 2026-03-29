# Bunny CDN Module

## Upload Pipeline


```
User Upload
    → API Server
    → Virus Scan (ClamAV or commercial)
    → Hash Computation (SHA-256/512)
    → Dedup Check (does this hash already exist?)
    → Store to Object Storage
    → Write metadata record to DB
    → Invalidate/warm CDN cache
    → Trigger any indexing jobs (search index update, etc.)
```

## Download Pipeline / URL Architecture

```bash
https://data.homestead.systems/repo/project/{project_slug}/releases/{version_name}/files/{file_name}
```

```
User Clicks Download
    → API Server
        → Run Checks
            → What is their auth/session status
            → What is their perms
            → Is valid download request?
        → Increments downloadCount
        → Logs the Request
        → 302 Redirect to specific CDN URL
    → 
```



## Notes

- Make sure to do more research on possible already listed file hash/s and url's from previous hack's/virus's used. 
    - Example: https://www.bitdefender.com/en-us/blog/labs/infected-minecraft-mods-lead-to-multi-stage-multi-platform-infostealer-malware
    - https://github.com/trigram-mrp/fractureiser/tree/main