const public_key = $file.read("resources/id_rsa.pub").string
const private_key = $file.read("resources/id_rsa").string

$ssh.connect({
  host: "",
  port: 22,
  username: "",
  public_key: public_key,
  private_key: private_key,
  script: "ls -l /var/lib/",
  handler: function(session, response) {
    console.log("connect: " + session.connected)
    console.log("authorized: " + session.authorized)
    console.log("response: " + response)
    console.log("port: " + session.port)
    session.channel.upload({
      path: "resources/notes.md",
      dest: "/home/user/notes.md",
      handler: function(success) {
        console.log("success: " + success)
      }
    })
  }
})