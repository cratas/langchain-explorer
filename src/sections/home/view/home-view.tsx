'use client';

import { BrowserLayout } from '@/layouts';
import { ModerationLayerView } from '@/sections/moderation-layer/view';
import { Tabs, TabsHeader, Tab, TabsBody, TabPanel } from '@material-tailwind/react';
import { useState } from 'react';

enum TabsEnum {
  CUSTOMER_SUPPORT,
  MODERATION_LAYER,
  EMAIL_AUTORESPONDER,
}

const TABS = [
  {
    label: 'Moderation Layer',
    value: TabsEnum.MODERATION_LAYER,
    content: (
      <BrowserLayout>
        <ModerationLayerView />
      </BrowserLayout>
    ),
  },
  {
    label: 'E-mail Autoresponder',
    value: TabsEnum.EMAIL_AUTORESPONDER,
    content: (
      <BrowserLayout>
        <div>todo</div>
      </BrowserLayout>
    ),
  },
  {
    label: 'Customer support',
    value: TabsEnum.CUSTOMER_SUPPORT,
    content: <BrowserLayout>sdf</BrowserLayout>,
  },
];

export const HomeView = () => {
  const [activeTab, setActiveTab] = useState(TabsEnum.EMAIL_AUTORESPONDER);

  const renderTitle = (
    <h1 className="bg-gradient-to-b from-white via-gray-500 to-gray-800 bg-clip-text p-2 text-center text-6xl font-semibold text-transparent">
      Explore the power of LangChain
    </h1>
  );

  const renderSubTitle = (
    <p className="text-center text-xl font-semibold text-text-dark">
      Check some of the possibilities
    </p>
  );

  return (
    <div className="mt-10 flex flex-col gap-3">
      {renderTitle}
      {renderSubTitle}
      <div className="mt-10" />
      <Tabs value={activeTab}>
        <TabsHeader
          placeholder=""
          className="mx-auto mt-2 max-w-[40rem] rounded-none border-b border-gray-900 bg-transparent p-0"
          indicatorProps={{
            className:
              'bg-transparent border-b-2 border-lighter-purple purple-500 rounded-none shadow-inner',
          }}
        >
          {TABS.map(({ label, value }) => (
            <Tab
              placeholder=""
              key={value}
              value={value}
              onClick={() => setActiveTab(value)}
              className={
                activeTab === value ? 'py-3 font-bold text-text-light' : 'py-3 text-text-dark'
              }
            >
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody placeholder="">
          {TABS.map(({ value, content }) => (
            <TabPanel key={value} value={value}>
              {content}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
};
