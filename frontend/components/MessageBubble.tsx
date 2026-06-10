import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Landmark } from 'lucide-react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${
          isUser ? 'bg-blue-600 ml-3' : 'bg-emerald-700 mr-3'
        }`}>
          {isUser ? (
            <User className="h-6 w-6 text-white" />
          ) : (
            <Landmark className="h-6 w-6 text-white" />
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-4 rounded-2xl shadow-sm ${
            isUser 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
          }`}>
            {isUser ? (
              <p className="whitespace-pre-wrap">{message.text}</p>
            ) : (
              <div className="prose prose-sm md:prose-base max-w-none prose-slate">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({node, ...props}) => <p className="mb-4 last:mb-0 leading-relaxed" {...props} />,
                    a: ({node, ...props}) => <a className="text-emerald-600 hover:underline" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-6 mb-3 text-slate-900" {...props} />,
                    h4: ({node, ...props}) => <h4 className="text-md font-semibold mt-4 mb-2 text-slate-800" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-slate-900" {...props} />,
                    table: ({node, ...props}) => (
                      <div className="overflow-x-auto my-6 rounded-lg border border-slate-200 shadow-sm">
                        <table className="min-w-full divide-y divide-slate-200 text-sm" {...props} />
                      </div>
                    ),
                    thead: ({node, ...props}) => <thead className="bg-slate-50" {...props} />,
                    th: ({node, ...props}) => (
                      <th className="px-4 py-3 text-left font-semibold text-slate-900 tracking-wider" {...props} />
                    ),
                    tbody: ({node, ...props}) => <tbody className="bg-white divide-y divide-slate-200" {...props} />,
                    td: ({node, ...props}) => (
                      <td className="px-4 py-3 whitespace-normal text-slate-700 align-top" {...props} />
                    ),
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-slate-600 my-4 bg-emerald-50 py-2 pr-2 rounded-r" {...props} />
                    )
                  }}
                >
                  {message.text}
                </ReactMarkdown>
              </div>
            )}
          </div>
          <span className="text-xs text-slate-400 mt-1 px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};
