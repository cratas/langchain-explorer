'use client';

import { ChatBotView } from '@/frontend/sections/custom-chatbot/view';
import { CustomerSupportView } from '@/frontend/sections/customer-support/view';
import { ModerationView } from '@/frontend/sections/moderation/view';
import { Tabs, TabsHeader, Tab, TabsBody, TabPanel } from '@material-tailwind/react';
import { useState } from 'react';

enum TabsEnum {
  CUSTOM_CHATBOT = 'custom_chatbot',
  CUSTOMER_SUPPORT = 'customer_support',
  MODERATION_LAYER = 'moderation_layer',
}

const TABS = [
  {
    label: 'Q&A ChatBot (RAG)',
    value: TabsEnum.CUSTOM_CHATBOT,
    content: <ChatBotView />,
  },
  {
    label: 'Moderation Layer',
    value: TabsEnum.MODERATION_LAYER,
    content: <ModerationView />,
  },
  {
    label: 'Customer Support',
    value: TabsEnum.CUSTOMER_SUPPORT,
    content: <CustomerSupportView />,
  },
];

export const HomeView = () => {
  const [activeTab, setActiveTab] = useState(TabsEnum.CUSTOM_CHATBOT);

  const renderTitle = (
    <h1 className="bg-gradient-to-b from-white via-gray-500 to-gray-800 bg-clip-text p-2 text-center text-4xl font-semibold text-transparent md:text-6xl">
      Explore the power of LangChain
    </h1>
  );

  const renderSubTitle = (
    <p className="text-center text-xl font-semibold text-text-dark">
      Check some of the possibilities
    </p>
  );

  const renderButton = (
    <div className="mx-auto mb-2 w-fit rounded-full border-2 border-light-purple bg-black px-3 py-0.5 text-text-light">
      Context-Aware
    </div>
  );

  return (
    <div className="mt-2 flex flex-col gap-3">
      {renderButton}

      {renderTitle}

      {renderSubTitle}

      <div className="mt-10" />

      <Tabs value={activeTab}>
        <TabsHeader
          className="no-scrollbar mx-auto mt-2 max-w-[60rem] overflow-auto text-nowrap rounded-none border-b border-gray-900 bg-transparent p-0"
          indicatorProps={{
            className: 'bg-transparent border-b-2 border-lighter-purple rounded-none shadow-inner',
          }}
        >
          {TABS.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              onClick={() => setActiveTab(value)}
              className={
                activeTab === value
                  ? 'py-3 font-bold text-text-light'
                  : 'py-3 font-semibold text-text-dark'
              }
            >
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody className="mb-10">
          {TABS.map(({ value, content }) => (
            <TabPanel key={value} value={value} className="p-0">
              {content}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  );
};
