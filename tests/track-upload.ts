import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { TrackUpload } from '../target/types/track_upload';

describe('track-upload', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.TrackUpload as Program<TrackUpload>;

  it('Is initialized!', async () => {
    // Add your test here.
    const tx = await program.rpc.initialize({});
    console.log("Your transaction signature", tx);
  });
});
