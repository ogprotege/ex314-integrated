import React, { useEffect, useState, useRef } from 'react';
import { PlusIcon, SendIcon, PenIcon, BookOpenIcon, BookIcon, HardDriveIcon } from 'lucide-react';
interface ChatInputProps {
  onSendMessage: (message: string) => void;
}
export const ChatInput = ({
  onSendMessage
}: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoResizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 250)}px`;
    }
  };
  useEffect(() => {
    setIsButtonDisabled(message.trim().length === 0);
  }, [message]);
  useEffect(() => {
    autoResizeTextarea();
  }, [message]);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isButtonDisabled) {
        sendMessage();
      }
    }
  };
  const sendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };
  return <div className="w-full max-w-[800px] mx-auto flex flex-col gap-5">
      <div className="bg-card-bg border border-border-color rounded-2xl p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <button className="mt-1.5 text-gray-custom p-2 rounded-lg hover:bg-input-bg hover:text-white transition-colors" title="Attach file">
            <PlusIcon size={18} className="opacity-75" />
          </button>
          <textarea ref={textareaRef} className="flex-grow min-h-[24px] max-h-[250px] overflow-y-auto text-base leading-relaxed py-2 px-1 bg-transparent focus:outline-none placeholder:text-gray-custom/60 resize-none" placeholder="I'm guessing you decided to take the Red Pill today. Go ahead. Ask and you shall receive; seek and you shall find..... (Matthew 7:7)" value={message} onChange={e => setMessage(e.target.value)} onKeyDown={handleKeyDown} rows={1} />
          <button className={`rounded-full w-9 h-9 flex items-center justify-center mt-1 transition-all shadow-sm ${!isButtonDisabled ? 'bg-accent-purple hover:bg-purple-hover text-white' : 'bg-input-bg text-gray-custom cursor-not-allowed'}`} title="Send message" disabled={isButtonDisabled} onClick={sendMessage}>
            <SendIcon size={16} className={isButtonDisabled ? 'opacity-50' : ''} />
          </button>
        </div>
      </div>
      <div className="flex gap-2 justify-center flex-wrap">
        <ActionButton icon={<PenIcon size={15} />} label="Write" />
        <ActionButton icon={<BookOpenIcon size={15} />} label="Learn" />
        <ActionButton icon={<BookIcon size={15} />} label="Bible" />
        <ActionButton icon={<HardDriveIcon size={15} />} label="From Drive" />
      </div>
    </div>;
};
const ActionButton = ({
  icon,
  label
}: {
  icon: React.ReactNode;
  label: string;
}) => <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-input-bg hover:bg-card-bg transition-colors text-sm font-medium text-gray-custom hover:text-white">
    {icon}
    {label}
  </button>;
