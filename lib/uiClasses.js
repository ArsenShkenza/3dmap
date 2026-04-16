export const proseSoft = "text-pro-text-soft leading-[1.6]";
export const proseFaint = "text-pro-text-faint leading-[1.55]";
export const sectionLabel =
  "m-0 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-(--gold-bright)";
export const statLabel = sectionLabel;
export const serifHeading = "m-0 font-serif tracking-[0.01em]";
export const glassBorder = "border border-pro-line shadow-pro-panel";
export const detailCard =
  "grid gap-[18px] rounded-pro-lg p-[22px] border border-solid border-white/8 rounded-[16px] shadow-pro-panel [background:linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015)),rgba(7,12,19,0.78)] max-[820px]:rounded-pro-md max-[820px]:p-4";
/**
 * Scrollport for the map-stage rail — must include `detail-card` so `globals.css`
 * `.detail-card.detail-card-scroll` applies (align-content, extra padding-bottom).
 */
export const detailCardScrollShell =
  "detail-card detail-card-scroll flex-[1_1_auto] min-h-0 content-start overflow-x-hidden overflow-y-auto overscroll-contain [clip-path:inset(0_round_var(--radius-lg))] [scrollbar-color:rgba(241,211,161,0.24)_transparent] [scrollbar-width:thin] scroll-pb-[clamp(12px,2vw,24px)] pointer-events-auto box-border font-sans text-(--text) transition-opacity duration-[220ms] ease-out max-[1240px]:flex-none max-[1240px]:overflow-visible max-[1240px]:[clip-path:none]";
export const mutedInsetCard =
  "rounded-[18px] border border-white/8 p-[14px] [background:linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02)),rgba(255,255,255,0.02)]";
export const subtleCard =
  "rounded-[18px] border border-white/8 [background:linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015)),rgba(255,255,255,0.015)]";
export const pillBase =
  "inline-flex max-w-full items-center justify-center rounded-full text-center font-bold uppercase";
export const countPill =
  "inline-flex max-w-full items-center justify-center rounded-full bg-white/6 px-3 py-2 text-center text-[0.72rem] font-bold uppercase tracking-[0.08em] text-pro-text-soft";
export const statusPill =
  "inline-flex max-w-full items-center justify-center rounded-full bg-[rgba(214,180,123,0.14)] px-3 py-2 text-center text-[0.72rem] font-bold uppercase tracking-[0.08em] text-pro-gold-bright";
export const subtleStatusPill =
  "inline-flex max-w-full items-center justify-center rounded-full bg-white/6 px-3 py-2 text-center text-[0.72rem] font-bold uppercase tracking-[0.08em] text-pro-text-soft";
/**
 * Topbar section tabs — colors/fonts align with `app/globals.css` `:root` tokens
 * (`--text-soft`, etc.) and the sans stack from `tailwind.config.js` (`font-sans`).
 * Layout `flex: 1 1; min-width: 0` is applied on the button in `ExperienceShell`.
 */
/** Topbar tabs — use `aria-selected` for active gold (hover utilities would otherwise win in the stylesheet). */
export const navButton =
  "font-sans inline-flex cursor-pointer items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] px-[14px] py-3 text-[0.78rem] font-bold leading-none uppercase tracking-[0.12em] text-(--text-soft) antialiased box-border transition-[transform,border-color,background-color,color] duration-[180ms] ease-out hover:-translate-y-px hover:border-[rgba(241,211,161,0.24)] hover:bg-[rgba(255,255,255,0.055)] hover:text-(--text) aria-selected:border-[rgba(241,211,161,0.3)] aria-selected:text-(--gold-bright) aria-selected:[background:linear-gradient(180deg,rgba(214,180,123,0.14),rgba(214,180,123,0.05)),rgba(255,255,255,0.03)] aria-selected:hover:border-[rgba(241,211,161,0.34)] aria-selected:hover:text-(--gold-bright) aria-selected:hover:[background:linear-gradient(180deg,rgba(214,180,123,0.16),rgba(214,180,123,0.06)),rgba(255,255,255,0.04)]";
/** Category / filter chips — `aria-pressed="true"` keeps gold border/text over base + hover utilities. */
export const chipButton =
  "rounded-full border border-white/10 bg-white/[0.035] px-[14px] py-[10px] text-pro-text transition duration-200 ease-out hover:-translate-y-px hover:border-[rgba(241,211,161,0.24)] aria-pressed:border-[rgba(241,211,161,0.32)] aria-pressed:bg-[rgba(214,180,123,0.14)] aria-pressed:text-(--gold-bright) aria-pressed:hover:border-[rgba(241,211,161,0.38)] aria-pressed:hover:text-(--gold-bright)";
/** List / vault tiles — set `aria-pressed={true}` when selected so the gold fill wins over the default surface. */
export const switcherCard =
  "w-full rounded-[18px] border border-white/8 p-4 text-left text-inherit [background:linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015)),rgba(255,255,255,0.015)] transition duration-200 ease-out hover:-translate-y-px hover:border-[rgba(241,211,161,0.24)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[rgba(141,211,255,0.7)] aria-pressed:border-[rgba(241,211,161,0.34)] aria-pressed:[background:linear-gradient(180deg,rgba(214,180,123,0.12),rgba(214,180,123,0.04)),rgba(255,255,255,0.03)] aria-pressed:hover:border-[rgba(241,211,161,0.38)]";
export const primaryLinkButton =
  "inline-flex w-fit max-w-full items-center justify-center rounded-full border border-[rgba(241,211,161,0.2)] px-[18px] py-3 text-center text-pro-text no-underline font-bold uppercase tracking-[0.08em] transition duration-200 ease-out [background:linear-gradient(180deg,rgba(214,180,123,0.18),rgba(214,180,123,0.07)),rgba(255,255,255,0.03)] hover:-translate-y-px hover:border-[rgba(241,211,161,0.32)] hover:text-pro-gold-bright";
export const ghostLinkButton =
  "inline-flex w-fit max-w-full items-center justify-center rounded-full border border-[rgba(241,211,161,0.2)] bg-white/[0.03] px-[18px] py-3 text-center text-pro-text-soft no-underline font-bold uppercase tracking-[0.08em] transition duration-200 ease-out hover:-translate-y-px hover:border-[rgba(241,211,161,0.32)] hover:text-pro-gold-bright";
export const iconButton =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(241,211,161,0.22)] bg-white/[0.04] text-pro-text-soft transition duration-200 ease-out hover:-translate-y-px hover:border-[rgba(241,211,161,0.34)] hover:text-pro-gold-bright";
