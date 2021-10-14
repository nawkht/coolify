import { asyncExecShell } from "../common"

export default async function (job) {
  const { destinationDocker, domain } = job.data
  const destinationSwarm = null
  const kubernetes = null
  // Set SSL with Let's encrypt
  if (destinationDocker) {
    // Deploy to docker
    // TODO: Must be localhost
    if (destinationDocker.engine === '/var/run/docker.sock') {
      // TODO: Must wait if there is a certbot container already running
      // saveBuildLog({ line: 'Requesting SSL cert.', buildId })
      const { stdout, stderr } = await asyncExecShell(`docker run --rm --name certbot -p 9080:9080 -v "/data/coolify/letsencrypt:/etc/letsencrypt" certbot/certbot --logs-dir /etc/letsencrypt/logs certonly --standalone --preferred-challenges http --http-01-address 0.0.0.0 --http-01-port 9080 -d domains --agree-tos --non-interactive --register-unsafely-without-email --test-cert`)
      if (stderr) console.log(stderr)
      console.log(stdout)
      // saveBuildLog({ line: 'SSL cert requested successfully!', buildId })
      // saveBuildLog({ line: 'Parsing SSL cert.', buildId })
      await asyncExecShell(`cat /data/coolify/letsencrypt/live/${domain}/fullchain.pem /data/coolify/letsencrypt/live/${domain}/privkey.pem > /data/coolify/haproxy/ssl/${domain}.pem`)
      // saveBuildLog({ line: 'SSL cert parsed.', buildId })
      // saveBuildLog({ line: 'Reloading Haproxy', buildId })
      await asyncExecShell(`docker kill -s HUP coolify-haproxy`)
      // saveBuildLog({ line: 'Reloading Haproxy done', buildId })
      // Add SSL only mode or it should be configured via a button? 🤔
    }



    // TODO: Implement remote docker engine

  } else if (destinationSwarm) {
    // Deploy to swarm
  } else if (kubernetes) {
    // Deploy to k8s
  }

}