use anchor_lang::prelude::*;

declare_id!("BkYwBxc3DvKo6vKVWYBF3qjeP4Rgy5PNhmDi1iz8SBWz");

#[program]
pub mod track_upload {
    use super::*;
    pub fn upload_track(
        ctx: Context<UploadTrack>,
        title: String,
        mp3_cid: String,
        art_cid: String,
    ) -> ProgramResult {
        if title.chars().count() > 50 {
            return Err(ErrorCode::TitleTooLong.into());
        }
        if mp3_cid.chars().count() > 50 {
            return Err(ErrorCode::CIDTooLong.into());
        }
        if art_cid.chars().count() > 50 {
            return Err(ErrorCode::CIDTooLong.into());
        }
        let track = &mut ctx.accounts.track;
        track.signer = ctx.accounts.signer.key();
        track.id = track.key();
        track.title = title;
        track.mp3_cid = mp3_cid;
        track.art_cid = art_cid;
        Ok(())
    }
    pub fn update_track(
        ctx: Context<UpdateTrack>,
        title: String,
        mp3_cid: String,
        art_cid: String,
    ) -> ProgramResult {
        if title.chars().count() > 50 {
            return Err(ErrorCode::TitleTooLong.into());
        }
        if mp3_cid.chars().count() > 50 {
            return Err(ErrorCode::CIDTooLong.into());
        }
        if art_cid.chars().count() > 50 {
            return Err(ErrorCode::CIDTooLong.into());
        }
        let track = &mut ctx.accounts.track;
        track.title = title;
        track.mp3_cid = mp3_cid;
        track.art_cid = art_cid;
        Ok(())
    }
}

// Data Validators
#[derive(Accounts)]
pub struct UploadTrack<'info> {
    pub signer: Signer<'info>,
    #[account(init_if_needed, payer = signer, space = Track::LEN)]
    pub track: Account<'info, Track>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct UpdateTrack<'info> {
    pub signer: Signer<'info>,
    #[account(mut, has_one = signer)]
    pub track: Account<'info, Track>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

// Data Structures
const DISCRIMINATOR_LENGTH: usize = 8;
const SIGNER_LENGTH: usize = 32;
const ID_LENGTH: usize = 32;
const TITLE_PREFIX_LENGTH: usize = 4;
const MAX_TITLE_LENGTH: usize = 50;
const MP3_PREFIX_LENGTH: usize = 4;
const MAX_MP3_LENGTH: usize = 50;
const ART_PREFIX_LENGTH: usize = 4;
const MAX_ART_LENGTH: usize = 50;

#[account]
pub struct Track {
    pub signer: Pubkey,
    pub id: Pubkey,
    pub title: String,
    pub mp3_cid: String,
    pub art_cid: String,
}

impl Track {
    const LEN: usize = DISCRIMINATOR_LENGTH
        + SIGNER_LENGTH
        + ID_LENGTH
        + TITLE_PREFIX_LENGTH
        + MAX_TITLE_LENGTH
        + MP3_PREFIX_LENGTH
        + MAX_MP3_LENGTH
        + ART_PREFIX_LENGTH
        + MAX_ART_LENGTH;
}

// Error Codes
#[error]
pub enum ErrorCode {
    #[msg("Title must be 50 characters or less")]
    TitleTooLong,
    #[msg("CID must be 50 characters or less")]
    CIDTooLong,
}
