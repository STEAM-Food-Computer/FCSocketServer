net = require('net');

net.createServer(function (socket) {

    // Identify this client
    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    console.log("name:"  + socket.name);
    // Send message to client
    socket.write("Welcome " + socket.name + "\n");


    // Handle incoming messages from clients. Convert byte array to string UTF-8 format
    socket.on('data', function (data) {
        console.log(stringFromUTF8Array(data));
    });

    // display message when client leaves
    socket.on('end', function () {
        console.log("client ended");
    });

    function stringFromUTF8Array(data)
    {
        const extraByteMap = [ 1, 1, 1, 1, 2, 2, 3, 0 ];
        var count = data.length;
        var str = "";

        for (var index = 0;index < count;)
        {
            var ch = data[index++];
            if (ch & 0x80)
            {
                var extra = extraByteMap[(ch >> 3) & 0x07];
                if (!(ch & 0x40) || !extra || ((index + extra) > count))
                return null;

                ch = ch & (0x3F >> extra);
                for (;extra > 0;extra -= 1)
                {
                    var chx = data[index++];
                    if ((chx & 0xC0) != 0x80)
                    return null;

                    ch = (ch << 6) | (chx & 0x3F);
                }
            }
            str += String.fromCharCode(ch);
        }
        return str;
    }

}).listen(5000);

console.log("Server running on port 5000");
