var Peer = require('simple-peer')
var wrtc = require('wrtc')
var p = new Peer({ initiator: window.location.hash === "#1", trickle: false, wrtc: wrtc })
var p2 = new Peer({ wrtc: wrtc })



p.on('error', function (err) { console.log('error', err) })

p.on('signal', function (data) {
  console.log('SIGNAL', JSON.stringify(data))
  alert("Inside On ", `${data}`)
  document.querySelector('#outgoing').textContent = JSON.stringify(data)
})

document.querySelector('form').addEventListener('submit', function (ev) {
  ev.preventDefault()
  p.signal(JSON.parse(document.querySelector('#incoming').value))
})

p.on('connect', function () {
  console.log('CONNECT')
  p.send('You are connected' + Math.random())

  navigator.getUserMedia({ video: false, audio: true }, gotMedia, function () { })

  function gotMedia(stream) {
    var peer1 = new Peer({ initiator: true, stream: stream })
    var peer2 = new Peer({ stream: stream })

    peer1.on('signal', function (data) {
      peer2.signal(data)
    })

    peer2.on('signal', function (data) {
      peer1.signal(data)
    })

    peer2.on('stream', function (stream) {
      // got remote video stream, now let's show it in a video tag
      var audio = document.querySelector('audio')
      audio.srcObject = stream;
      audio.play()
    })
  }
  
})

p.on('data', function (data) {
  console.log('data: ' + data)
})

