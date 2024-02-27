'use client';

import { BrowserLayout } from '@/layouts';
import { ChatBotView } from '@/sections/chatbot/view';
import { ModerationView } from '@/sections/moderation/view';
import { Tabs, TabsHeader, Tab, TabsBody, TabPanel } from '@material-tailwind/react';
import { useState } from 'react';

enum TabsEnum {
  CUSTOM_CHATBOT,
  CUSTOMER_SUPPORT,
  MODERATION_LAYER,
  EMAIL_AUTORESPONDER,
}

const TABS = [
  {
    label: 'Q&A ChatBot (RAG)',
    value: TabsEnum.CUSTOM_CHATBOT,
    content: (
      <BrowserLayout>
        <ChatBotView />
      </BrowserLayout>
    ),
  },
  {
    label: 'Moderation Layer',
    value: TabsEnum.MODERATION_LAYER,
    content: (
      <BrowserLayout>
        <ModerationView />
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
  const [activeTab, setActiveTab] = useState(TabsEnum.CUSTOM_CHATBOT);

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

  const renderButton = (
    <div className="mx-auto mb-2 w-fit rounded-full border-2 border-light-purple bg-black px-3 py-0.5 text-text-light">
      {/* <span className="icon-[gravity-ui--hand-point-down] " /> */}
      Context-Aware
    </div>
  );

  return (
    <div className="mt-10 flex flex-col gap-3">
      {renderButton}

      {renderTitle}

      {renderSubTitle}

      <div className="mt-10" />

      <Tabs value={activeTab}>
        <TabsHeader
          placeholder=""
          className="no-scrollbar mx-auto mt-2 max-w-[50rem] overflow-auto text-nowrap rounded-none border-b border-gray-900 bg-transparent p-0"
          indicatorProps={{
            className: 'bg-transparent border-b-2 border-lighter-purple rounded-none shadow-inner',
          }}
        >
          {TABS.map(({ label, value }) => (
            <Tab
              placeholder=""
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
        <TabsBody placeholder="" className="mt-5">
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
