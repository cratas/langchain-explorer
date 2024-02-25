import { Message } from 'ai';
import { atom } from 'jotai';

// Global state for the messages from the GPT
export const gptMessagesAtom = atom<Message[]>([]);

// Random value to trigger a scroll event from the compare message
export const gptMessageScrollHelper = atom<string>('');
