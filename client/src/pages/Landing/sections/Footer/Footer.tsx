import { FC } from 'react';

import { InstagramOutlined, XOutlined, FacebookOutlined } from '@ant-design/icons';

import './footer.styles.scss';

const linkSections = [
  {
    title: 'Company',
    links: [
      {
        name: 'About',
        link: '',
      },
      {
        name: 'Contact',
        link: '',
      },
      {
        name: 'Privacy Policy',
        link: '',
      },
    ],
  },
  {
    title: 'Account',
    links: [
      {
        name: 'Sign Up',
      },
      {
        name: 'Log In',
      },
      {
        name: 'Terms',
      },
    ],
  },
];

const Footer: FC = () => {
  return (
    <section className="footer">
      <div className="logo">{`<Logo />`}</div>
      <div className="links">
        {linkSections.map((linkSection) => {
          const { title, links } = linkSection;
          return (
            <div className="link-section">
              <div className="link-section-title">{title}</div>
              {links.map((item) => {
                return <div className="link">{item.name}</div>;
              })}
            </div>
          );
        })}
      </div>
      <div className="socials">
        <InstagramOutlined />
        <XOutlined />
        <FacebookOutlined />
      </div>
    </section>
  );
};

export default Footer;
