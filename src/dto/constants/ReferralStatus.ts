export enum ReferralStatus {
  CREATED = "CREATED",
  SENT = "SENT",
  ACCEPTED = "ACCEPTED",
  ARRIVED = "ARRIVED",
  COMPLETED = "COMPLETED",
  FOLLOW_UP_SCHEDULED = "FOLLOW_UP_SCHEDULED",
}

export const REFERRAL_FLOW: ReferralStatus[] = [
  ReferralStatus.CREATED,
  ReferralStatus.SENT,
  ReferralStatus.ACCEPTED,
  ReferralStatus.ARRIVED,
  ReferralStatus.COMPLETED,
  ReferralStatus.FOLLOW_UP_SCHEDULED,
];
