# track-upload
Take home anchor project for the audius team &lt;3

To run all you need to do is cd into app and run yarn install then yarn dev.
The application is deployed to the solana devnet.

The application is using this online ipfs uploader to function:
https://anarkrypto.github.io/upload-files-to-ipfs-from-browser-panel/public/
(It's just running on infura one) 

I'm not used to using ipfs yet so I'm not sure if there's different nets (dev/main) etc etc
but basically if you can access your upload file via <CID>.ipfs.infura-ipfs.io then the app 
can use it.

To use the app upload a track (mp3 / art) and then submit it onchain.
Once you submit a track you (and only your wallet) can update that track.

If you have the id of a track you can search for it.
You can copy the id of a track by clicking on it in the card.
You can play the track by clicking on the play button for that track.

If you submit multiple tracks you can choose which one to update by copying
that track's id and then searching for it in the search box. Once it's found 
update track above will be set to that track.

If you copy someone elses track and try and update it then it'll fail.

Things to do:

- Give the app better UI/UX
- Make it mobile responsive
