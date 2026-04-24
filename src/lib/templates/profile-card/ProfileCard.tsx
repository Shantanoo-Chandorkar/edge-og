import React from 'react';

interface ProfileCardProps {
    name?: string;
    title?: string;
    avatarUrl?: string;
    company?: string;
    twitterHandle?: string;
    githubHandle?: string;
    bio?: string;
}

/**
 * Profile card template for Satori rendering.
 * Centered layout with avatar, name, title, social handles, and bio.
 * All elements are conditionally rendered.
 *
 * @param props - Profile card visual properties
 */
export function ProfileCard(props: ProfileCardProps): React.ReactElement {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '1200px',
                height: '630px',
                backgroundColor: '#0f172a',
                fontFamily: 'Inter',
                padding: '60px',
                gap: '24px',
            }}
        >
            {/* Avatar */}
            {props.avatarUrl && (
                <img
                    src={props.avatarUrl}
                    width={120}
                    height={120}
                    style={{
                        borderRadius: '50%',
                        border: '3px solid #6366f1',
                    }}
                />
            )}

            {/* Name */}
            {props.name && (
                <div
                    style={{
                        display: 'flex',
                        color: '#f8fafc',
                        fontSize: '60px',
                        fontWeight: 700,
                        lineHeight: 1.1,
                    }}
                >
                    {props.name}
                </div>
            )}

            {/* Title + Company */}
            {(props.title || props.company) && (
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: '#94a3b8',
                        fontSize: '28px',
                    }}
                >
                    {props.title && <span style={{ display: 'flex' }}>{props.title}</span>}
                    {props.title && props.company && (
                        <span style={{ display: 'flex', color: '#475569' }}>@</span>
                    )}
                    {props.company && (
                        <span style={{ display: 'flex', color: '#6366f1', fontWeight: 600 }}>
                            {props.company}
                        </span>
                    )}
                </div>
            )}

            {/* Bio */}
            {props.bio && (
                <div
                    style={{
                        display: 'flex',
                        color: '#64748b',
                        fontSize: '22px',
                        textAlign: 'center',
                        maxWidth: '800px',
                        lineHeight: 1.6,
                    }}
                >
                    {props.bio}
                </div>
            )}

            {/* Social handles */}
            {(props.twitterHandle || props.githubHandle) && (
                <div
                    style={{
                        display: 'flex',
                        gap: '16px',
                    }}
                >
                    {props.twitterHandle && (
                        <div
                            style={{
                                display: 'flex',
                                backgroundColor: '#1e293b',
                                borderRadius: '8px',
                                padding: '8px 20px',
                                color: '#94a3b8',
                                fontSize: '20px',
                                gap: '8px',
                                alignItems: 'center',
                            }}
                        >
                            <span style={{ display: 'flex', color: '#1d9bf0' }}>X</span>
                            <span style={{ display: 'flex' }}>@{props.twitterHandle}</span>
                        </div>
                    )}
                    {props.githubHandle && (
                        <div
                            style={{
                                display: 'flex',
                                backgroundColor: '#1e293b',
                                borderRadius: '8px',
                                padding: '8px 20px',
                                color: '#94a3b8',
                                fontSize: '20px',
                                gap: '8px',
                                alignItems: 'center',
                            }}
                        >
                            <span style={{ display: 'flex' }}>github.com/{props.githubHandle}</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
