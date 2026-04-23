import React from 'react';

interface BlogCardProps {
    title?: string;
    author?: string;
    avatarUrl?: string;
    readTime?: string;
    tag?: string;
    siteUrl?: string;
    accentColor?: string;
}

/**
 * Blog card template for Satori rendering.
 * Dark background with large title, author info, and metadata chips.
 * All elements are conditionally rendered — omitting a prop hides that element.
 *
 * @param props - Blog card visual properties
 */
export function BlogCard(props: BlogCardProps): React.ReactElement {
    const accent = props.accentColor || '#6366f1';

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '1200px',
                height: '630px',
                backgroundColor: '#0f172a',
                fontFamily: 'Inter',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Accent strip at top */}
            <div
                style={{
                    display: 'flex',
                    height: '6px',
                    backgroundColor: accent,
                    width: '100%',
                }}
            />

            {/* Main content area */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    padding: '60px 80px',
                    justifyContent: 'space-between',
                }}
            >
                {/* Top: tag chip */}
                {props.tag && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                backgroundColor: accent + '22',
                                border: `1px solid ${accent}`,
                                borderRadius: '6px',
                                padding: '6px 16px',
                                color: accent,
                                fontSize: '18px',
                                fontWeight: 600,
                            }}
                        >
                            {props.tag}
                        </div>
                    </div>
                )}

                {/* Center: title */}
                {props.title && (
                    <div
                        style={{
                            display: 'flex',
                            color: '#f8fafc',
                            fontSize: props.title.length > 60 ? '48px' : '64px',
                            fontWeight: 700,
                            lineHeight: 1.15,
                            maxWidth: '900px',
                        }}
                    >
                        {props.title}
                    </div>
                )}

                {/* Bottom: author row + site URL */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                    }}
                >
                    {/* Author row */}
                    {(props.author || props.readTime) && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '20px',
                            }}
                        >
                            {props.avatarUrl && (
                                <img
                                    src={props.avatarUrl}
                                    width={52}
                                    height={52}
                                    style={{
                                        borderRadius: '50%',
                                        border: `2px solid ${accent}`,
                                    }}
                                />
                            )}
                            {props.author && (
                                <div
                                    style={{
                                        display: 'flex',
                                        color: '#94a3b8',
                                        fontSize: '24px',
                                        fontWeight: 500,
                                    }}
                                >
                                    {props.author}
                                </div>
                            )}
                            {props.readTime && (
                                <div
                                    style={{
                                        display: 'flex',
                                        color: '#64748b',
                                        fontSize: '22px',
                                    }}
                                >
                                    · {props.readTime}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Site URL */}
                    {props.siteUrl && (
                        <div
                            style={{
                                display: 'flex',
                                color: '#475569',
                                fontSize: '20px',
                            }}
                        >
                            {props.siteUrl}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
