import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
 {
        id: 2,
        label: 'My Dashboard',
        icon: 'bx bx-home',
        link: '/dashboard',
 },
 {
    id: 2,
    label: 'Charity',
    icon: 'bx bx-group',
    link: '/charity',
},
    {
        id: 2,
        label: 'Transactions',
        icon: 'bx bx-git-repo-forked',
        link: '/transactions',
    },
    {
        id: 2,
        label: 'Analytics',
        icon: 'bx bx-line-chart',
        link: '/analytics',
    },
    {
        id: 2,
        label: 'Payout',
        icon: 'bx bx-credit-card',
        link: '/payout',
        badge: {
            variant: 'primary',
            text: '0',
        },
    },
    {
        id: 2,
        label: 'Charity Drive',
        icon: 'bx bxs-briefcase-alt',
        link: '/drives',
        badge: {
            variant: 'primary',
            text: '0',
        },
 },
    {
        id: 2,
        label: 'Support',
        icon: 'bx bx-support',
        link: '/support',
        badge: {
            variant: 'primary',
            text: '0',
        },
    },
  
];

