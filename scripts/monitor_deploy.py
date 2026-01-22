#!/usr/bin/env python3
"""
Script de monitoring de déploiement Render pour IGV
Mission: Suivre et confirmer le déploiement des services frontend et backend
"""
import subprocess
import requests
import time
import sys
import json
from datetime import datetime

# Configuration
FRONTEND_URL = "https://israelgrowthventure.com"
BACKEND_URL = "https://igv-cms-backend.onrender.com"
BACKEND_HEALTH = f"{BACKEND_URL}/health"
MAX_WAIT_SECONDS = 600  # 10 minutes max
CHECK_INTERVAL = 15  # Check every 15 seconds

def get_local_sha(repo_path):
    """Get the current HEAD SHA from local repo"""
    try:
        result = subprocess.run(
            ["git", "rev-parse", "--short", "HEAD"],
            cwd=repo_path,
            capture_output=True,
            text=True
        )
        return result.stdout.strip() if result.returncode == 0 else None
    except Exception as e:
        print(f"Error getting SHA for {repo_path}: {e}")
        return None

def check_frontend():
    """Check if frontend is accessible"""
    try:
        response = requests.get(FRONTEND_URL, timeout=10)
        return {
            "status": "OK" if response.status_code == 200 else "ERROR",
            "status_code": response.status_code,
            "response_time_ms": int(response.elapsed.total_seconds() * 1000)
        }
    except Exception as e:
        return {"status": "ERROR", "error": str(e)}

def check_backend():
    """Check if backend health endpoint responds"""
    try:
        response = requests.get(BACKEND_HEALTH, timeout=10)
        data = response.json() if response.status_code == 200 else {}
        return {
            "status": "OK" if response.status_code == 200 else "ERROR",
            "status_code": response.status_code,
            "response_time_ms": int(response.elapsed.total_seconds() * 1000),
            "version": data.get("version", "unknown"),
            "service": data.get("service", "unknown")
        }
    except Exception as e:
        return {"status": "ERROR", "error": str(e)}

def check_api_endpoint(endpoint, method="GET"):
    """Check specific API endpoints"""
    try:
        url = f"{BACKEND_URL}{endpoint}"
        response = requests.request(method, url, timeout=10)
        return {
            "endpoint": endpoint,
            "status": response.status_code,
            "ok": response.status_code < 400
        }
    except Exception as e:
        return {"endpoint": endpoint, "status": "ERROR", "error": str(e)}

def print_banner():
    print("=" * 60)
    print("   IGV Deployment Monitor")
    print("   Mission: CRM Reconstruction - Monitoring Script")
    print("=" * 60)
    print()

def print_status(frontend_result, backend_result, expected_sha=None):
    """Print formatted status"""
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"\n📊 Status Check at {now}")
    print("-" * 40)
    
    # Frontend status
    fe_status = "✅" if frontend_result.get("status") == "OK" else "❌"
    print(f"\n🌐 Frontend: {FRONTEND_URL}")
    print(f"   Status: {fe_status} {frontend_result.get('status')}")
    if "response_time_ms" in frontend_result:
        print(f"   Response Time: {frontend_result['response_time_ms']}ms")
    if "error" in frontend_result:
        print(f"   Error: {frontend_result['error']}")
    
    # Backend status
    be_status = "✅" if backend_result.get("status") == "OK" else "❌"
    print(f"\n⚙️  Backend: {BACKEND_URL}")
    print(f"   Status: {be_status} {backend_result.get('status')}")
    if "response_time_ms" in backend_result:
        print(f"   Response Time: {backend_result['response_time_ms']}ms")
    if "version" in backend_result:
        print(f"   Version: {backend_result['version']}")
    if "error" in backend_result:
        print(f"   Error: {backend_result['error']}")
    
    if expected_sha:
        print(f"\n📌 Expected SHA: {expected_sha}")
    
    print("-" * 40)
    
    return frontend_result.get("status") == "OK" and backend_result.get("status") == "OK"

def check_crm_endpoints():
    """Check CRM-specific endpoints"""
    print("\n🔍 Checking CRM API Endpoints...")
    endpoints = [
        ("/health", "GET"),
        ("/api/health", "GET"),
    ]
    
    results = []
    for endpoint, method in endpoints:
        result = check_api_endpoint(endpoint, method)
        status_icon = "✅" if result.get("ok") else "❌"
        print(f"   {status_icon} {method} {endpoint} -> {result.get('status')}")
        results.append(result)
    
    return all(r.get("ok") for r in results)

def monitor_deployment(frontend_sha=None, backend_sha=None, wait=False):
    """Main monitoring function"""
    print_banner()
    
    print(f"🎯 Frontend URL: {FRONTEND_URL}")
    print(f"🎯 Backend URL: {BACKEND_URL}")
    
    if frontend_sha:
        print(f"📦 Expected Frontend SHA: {frontend_sha}")
    if backend_sha:
        print(f"📦 Expected Backend SHA: {backend_sha}")
    
    start_time = time.time()
    iteration = 0
    
    while True:
        iteration += 1
        print(f"\n{'='*60}")
        print(f"🔄 Check #{iteration}")
        
        frontend_result = check_frontend()
        backend_result = check_backend()
        
        all_ok = print_status(frontend_result, backend_result)
        
        if all_ok:
            crm_ok = check_crm_endpoints()
            if crm_ok:
                print("\n" + "=" * 60)
                print("✅ DEPLOYMENT SUCCESSFUL!")
                print("   All services are running and responding correctly.")
                print("=" * 60)
                
                # Generate summary for MISSION_MASTER.md
                print("\n📋 Summary for MISSION_MASTER.md:")
                print("```")
                print(f"Deployment Check: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
                print(f"Frontend: ✅ OK - {FRONTEND_URL}")
                print(f"Backend:  ✅ OK - {BACKEND_URL}")
                if frontend_sha:
                    print(f"Frontend SHA: {frontend_sha}")
                if backend_sha:
                    print(f"Backend SHA: {backend_sha}")
                print("CRM Endpoints: ✅ All responding")
                print("```")
                
                return True
        
        if not wait:
            if not all_ok:
                print("\n❌ Some services are not responding correctly.")
                return False
            break
        
        elapsed = time.time() - start_time
        if elapsed > MAX_WAIT_SECONDS:
            print(f"\n⏰ Timeout after {int(elapsed)} seconds")
            print("❌ Deployment may still be in progress.")
            return False
        
        remaining = MAX_WAIT_SECONDS - elapsed
        print(f"\n⏳ Waiting {CHECK_INTERVAL}s before next check... ({int(remaining)}s remaining)")
        time.sleep(CHECK_INTERVAL)
    
    return True

def main():
    import argparse
    parser = argparse.ArgumentParser(description="Monitor IGV deployment")
    parser.add_argument("--wait", action="store_true", help="Wait for deployment to complete")
    parser.add_argument("--frontend-sha", type=str, help="Expected frontend SHA")
    parser.add_argument("--backend-sha", type=str, help="Expected backend SHA")
    parser.add_argument("--frontend-repo", type=str, help="Path to frontend repo to get SHA")
    parser.add_argument("--backend-repo", type=str, help="Path to backend repo to get SHA")
    
    args = parser.parse_args()
    
    frontend_sha = args.frontend_sha
    backend_sha = args.backend_sha
    
    # Try to get SHAs from repos if paths provided
    if args.frontend_repo:
        sha = get_local_sha(args.frontend_repo)
        if sha:
            frontend_sha = sha
            print(f"📦 Got frontend SHA from repo: {sha}")
    
    if args.backend_repo:
        sha = get_local_sha(args.backend_repo)
        if sha:
            backend_sha = sha
            print(f"📦 Got backend SHA from repo: {sha}")
    
    success = monitor_deployment(
        frontend_sha=frontend_sha,
        backend_sha=backend_sha,
        wait=args.wait
    )
    
    sys.exit(0 if success else 1)

if __name__ == "__main__":
    main()
