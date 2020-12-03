import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/admin/dashboard',
    home: true,
  },
  {
    title: 'Users',
    group: true,
  },
  {
    title: 'Users',
    icon: 'people-outline',
    link: '/admin/users',
  },  
  {
    title: 'Tables',
    icon: 'layout-outline',
    link: '/admin/tables',
  }, 
  {
    title: 'Payments',
    icon: 'layout-outline',
    link: '/admin/payments',
  }, 
  {
    title: 'Games',
    group: true,
  },
  {
    title: 'Trivia',
    icon: 'question-mark-circle-outline',
    link: '/admin/quiz',
  }, 
  {
    title: 'Would You Rather',
    icon: 'question-mark-circle-outline',
    link: '/admin/wouldyourather',
  },
  {
    title: 'Never Have I Ever',
    icon: 'question-mark-circle-outline',
    link: '/admin/neverever',
  }, 
  
  {
    title: 'Masters',
    group: true,
  },  
  {
    title: 'Categories',
    icon: 'keypad',
    link: '/admin/categories',
  }, 
  {
    title: 'Personalities',
    icon: 'keypad',
    link: '/admin/personalities',
  }, 
  {
    title: 'Games',
    icon: 'keypad',
    link: '/admin/games',
  }, 
  {
    title: 'Plans',
    icon: 'keypad',
    link: '/admin/plans',
  },
  {
    title: 'Settings',
    icon: 'keypad',
    link: '/admin/settings',
  },  
  // {
  //   title: 'Redeem Categories',
  //   icon: 'keypad',
  //   link: '/admin/redeem-categories',
  // }, 

  {
    title: 'Vouchers',
    icon: 'keypad',
    link: '/admin/vouchers',
  }, 
  
];
