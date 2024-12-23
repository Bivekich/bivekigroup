import { PortableTextComponents } from '@portabletext/react';
import { Highlight, themes } from 'prism-react-renderer';

export const portableTextComponents: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-bold mb-4 mt-8">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mb-4 mt-8">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold mb-3 mt-6">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      return (
        <a
          href={value?.href}
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    },
    code: ({ children }) => (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm">{children}</code>
    ),
  },
  types: {
    code: ({ value }) => {
      return (
        <div className="mb-6">
          {value.filename && (
            <div className="bg-muted px-4 py-2 rounded-t-lg text-sm border-b border-border">
              {value.filename}
            </div>
          )}
          <Highlight
            theme={themes.oneDark}
            code={value.code}
            language={value.language || 'typescript'}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={`${className} p-4 overflow-x-auto ${
                  value.filename ? 'rounded-t-none' : 'rounded-lg'
                }`}
                style={style}
              >
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      );
    },
  },
};
