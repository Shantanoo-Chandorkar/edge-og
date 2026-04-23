import React from 'react';

interface ProductCardProps {
    productName?: string;
    tagline?: string;
    logoUrl?: string;
    price?: string;
    currency?: string;
    ctaText?: string;
    backgroundColor?: string;
}

/**
 * Product card template for Satori rendering.
 * Light card with product name, tagline, optional price, and CTA.
 * All elements are conditionally rendered.
 *
 * @param props - Product card visual properties
 */
export function ProductCard(props: ProductCardProps): React.ReactElement {
    const bg = props.backgroundColor || '#ffffff';
    const currency = props.currency || '$';

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '1200px',
                height: '630px',
                backgroundColor: bg,
                fontFamily: 'Inter',
            }}
        >
            {/* Main content */}
            <div
                style={{
                    display: 'flex',
                    flex: 1,
                    padding: '80px',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                }}
            >
                {/* Left: text content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        flex: 1,
                        gap: '24px',
                        paddingRight: '80px',
                    }}
                >
                    {props.productName && (
                        <div
                            style={{
                                display: 'flex',
                                fontSize: '72px',
                                fontWeight: 700,
                                color: '#0f172a',
                                lineHeight: 1.1,
                            }}
                        >
                            {props.productName}
                        </div>
                    )}
                    {props.tagline && (
                        <div
                            style={{
                                display: 'flex',
                                fontSize: '28px',
                                color: '#64748b',
                                fontWeight: 400,
                                lineHeight: 1.5,
                            }}
                        >
                            {props.tagline}
                        </div>
                    )}
                    {props.price && (
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    backgroundColor: '#0f172a',
                                    color: '#ffffff',
                                    borderRadius: '10px',
                                    padding: '10px 28px',
                                    fontSize: '32px',
                                    fontWeight: 700,
                                }}
                            >
                                {currency}{props.price}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: logo */}
                {props.logoUrl && (
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '220px',
                            height: '220px',
                        }}
                    >
                        <img
                            src={props.logoUrl}
                            width={200}
                            height={200}
                            style={{ objectFit: 'contain' }}
                        />
                    </div>
                )}
            </div>

            {/* CTA footer strip */}
            {props.ctaText && (
                <div
                    style={{
                        display: 'flex',
                        backgroundColor: '#0f172a',
                        padding: '28px 80px',
                        alignItems: 'center',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            color: '#ffffff',
                            fontSize: '26px',
                            fontWeight: 600,
                        }}
                    >
                        {props.ctaText}
                    </div>
                </div>
            )}
        </div>
    );
}
