import SharedMembershipsPage from 'amber/views/Memberships/Memberships'

import { MembershipWizard } from './MembershipWizard'

export const Memberships: React.FC = () => <SharedMembershipsPage newMembershipDialog={MembershipWizard} />
