import Head from 'next/head'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import * as anchor from '@project-serum/anchor'
import { Program, Provider } from '@project-serum/anchor'
import IDL from '../../target/idl/track_upload.json'
import { useEffect, useState, useRef } from 'react'
import CID from 'cids'
import Track from '../components/Track'

type programState = {
  program: anchor.Program<anchor.Idl>
  connection: anchor.web3.Connection
}

export default function Home() {
  const wallet = useAnchorWallet()
  const [programState, setProgramState] = useState({} as programState)
  const [tracks, setTracks] = useState([] as any)
  const [myTracks, setMyTracks] = useState([] as any)
  const [selectedTrack, setSelectedTrack] = useState(null as any)

  const titleRef = useRef<HTMLInputElement>(null)
  const mp3CidRef = useRef<HTMLInputElement>(null)
  const artCidRef = useRef<HTMLInputElement>(null)

  const setupProgram = async () => {
    const opts = {
      preflightCommitment: 'processed' as anchor.web3.ConfirmOptions,
    }
    const endpoint = 'https://api.devnet.solana.com '
    const connection = new anchor.web3.Connection(
      endpoint,
      opts.preflightCommitment
    )
    const provider = new Provider(connection, wallet!, opts.preflightCommitment)
    const track_upload = new anchor.web3.PublicKey(
      'BkYwBxc3DvKo6vKVWYBF3qjeP4Rgy5PNhmDi1iz8SBWz'
    )
    const programIDL = IDL as anchor.Idl
    const program = new Program(programIDL, track_upload, provider)

    // track account generation (pda)
    // const [track, trackBump] = await anchor.web3.PublicKey.findProgramAddress(
    //   [wallet!.publicKey?.toBuffer()],
    //   program.programId
    // )

    setProgramState({
      program,
      connection,
    })
  }

  const getMyTracks = async () => {
    // console.log('programState', programState)
    // memcp fetch
    const myTracks = await programState.program.account.track.all([
      {
        memcmp: {
          offset: 8, // Discriminator.
          bytes: wallet!.publicKey.toBase58(),
        },
      },
    ])
    console.log('myTracks', myTracks)
    // const myTracks = await programState.program.account.track.fetch(
    //   programState.track
    // )
    if (myTracks.length > 0) {
      setMyTracks(myTracks)
      setSelectedTrack(myTracks[0])
    }
    const tracks = await programState.program.account.track.all()
    console.log('tracks', tracks)
    setTracks(tracks)
    // console.log('myTrack', myTrack)
  }

  const uploadTrack = async () => {
    console.log('upload track ran')
    const title = titleRef.current?.value
    const mp3Cid = mp3CidRef.current?.value
    const artCid = artCidRef.current?.value
    const track = anchor.web3.Keypair.generate()
    // console.log('title', title)
    // console.log('mp3Cid', mp3Cid)
    // console.log('artCid', artCid)
    await programState.program.rpc.uploadTrack(title, mp3Cid, artCid, {
      accounts: {
        signer: wallet!.publicKey,
        track: track.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      },
      signers: [track],
    })
    // console.log('tx', tx)
    setSelectedTrack(track)
    await getMyTracks()
  }
  const updateTrack = async () => {
    console.log('update track ran')
    const title = titleRef.current?.value
    const mp3Cid = mp3CidRef.current?.value
    const artCid = artCidRef.current?.value
    // console.log('title', title)
    // console.log('artCid', artCid)
    // console.log('mp3Cid', mp3Cid
    console.log('selectedTrack', selectedTrack)
    await programState.program.rpc.updateTrack(title, mp3Cid, artCid, {
      accounts: {
        signer: wallet!.publicKey,
        track: selectedTrack.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      },
    })
    // console.log('tx', tx)
    await getMyTracks()
  }
  const likeTrack = async (programTrack: any) => {
    console.log('like track ran')
    // console.log('programTrack', programTrack)
    // track account generation (pda)
    // const [track, _trackBump] = await anchor.web3.PublicKey.findProgramAddress(
    //   [programTrack.signer.toBuffer()],
    //   programState.program.programId
    // )
    // // console.log('track', track)
    // await programState.program.rpc.likeTrack({
    //   accounts: {
    //     signer: wallet!.publicKey,
    //     track: track,
    //     systemProgram: anchor.web3.SystemProgram.programId,
    //     rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    //   },
    // })
    // await getMyTracks()
  }

  useEffect(() => {
    if (wallet?.publicKey) {
      setupProgram()
    }
  }, [wallet])
  useEffect(() => {
    if (programState.program && wallet?.publicKey) {
      getMyTracks()
    }
  }, [programState])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Track Upload</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center"> */}
      <main className="w-[32rem]">
        <div className="mockup-window bg-base-300">
          <div className="grid w-full grid-cols-1 justify-center bg-base-200 px-16 py-16">
            <div className="mb-8 grid justify-center">
              <WalletMultiButton />
            </div>

            {/* Submit / Update Track */}
            {wallet?.publicKey ? (
              <div className="mb-4">
                {myTracks.length > 0 ? (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Update Track:</span>
                    </label>
                    <label className="input-group-xs input-group mb-2">
                      <span>Title</span>
                      <input
                        ref={titleRef}
                        type="text"
                        placeholder={myTracks[0].account.title}
                        className="input-bordered input input-xs w-full"
                      />
                    </label>
                    <label className="input-group-xs input-group mb-2">
                      <span>Mp3</span>
                      <input
                        ref={mp3CidRef}
                        type="text"
                        placeholder={myTracks[0].account.mp3Cid}
                        className="input-bordered input input-xs w-full"
                      />
                    </label>
                    <label className="input-group-xs input-group mb-2">
                      <span>Artwork</span>
                      <input
                        ref={artCidRef}
                        type="text"
                        placeholder={myTracks[0].account.artCid}
                        className="input-bordered input input-xs w-full"
                      />
                    </label>
                    <button className="btn btn-xs" onClick={updateTrack}>
                      Submit
                    </button>
                  </div>
                ) : (
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Create Track:</span>
                    </label>
                    <label className="input-group-xs input-group mb-2">
                      <span>Title</span>
                      <input
                        ref={titleRef}
                        type="text"
                        placeholder="soundtrack 1 / myXis"
                        className="input-bordered input input-xs w-full"
                      />
                    </label>
                    <label className="input-group-xs input-group mb-2">
                      <span>Mp3</span>
                      <input
                        ref={mp3CidRef}
                        type="text"
                        placeholder="QmXhhPV6VFnRJEwSgLKK8ddQVEyPT74177SoRyHhXhWXY2"
                        className="input-bordered input input-xs w-full"
                      />
                    </label>
                    <label className="input-group-xs input-group mb-2">
                      <span>Artwork</span>
                      <input
                        ref={artCidRef}
                        type="text"
                        placeholder="Qmf6TNt76pTQ6jj8Kz7iaGZwFLGdR9fPs28GkdPezWFVmZ"
                        className="input-bordered input input-xs w-full"
                      />
                    </label>
                    <button className="btn btn-xs" onClick={uploadTrack}>
                      Submit
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-4 text-center">
                <p>Please connect your wallet above to use the app.</p>
              </div>
            )}
            {wallet?.publicKey && (
              <div>
                {tracks.map((track: any, i: number) => {
                  // CID EXAMPLE
                  const mp3 = new CID(track.account.mp3Cid)
                    .toV1()
                    .toString('base32')
                  console.log('mp3: ', mp3)
                  const art = new CID(track.account.artCid)
                    .toV1()
                    .toString('base32')
                  console.log('art: ', art)
                  const mp3Url = `https://${mp3}.ipfs.infura-ipfs.io`
                  const artUrl = `https://${art}.ipfs.infura-ipfs.io`
                  console.log('mp3Url: ', mp3Url)
                  console.log('artUrl: ', artUrl)
                  console.log('track', track)
                  return (
                    <div
                      key={i}
                      className="side card compact bg-base-100 shadow-lg"
                    >
                      <Track
                        mp3={mp3Url}
                        art={artUrl}
                        title={track.account.title}
                        id={track.account.id.toString()}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
