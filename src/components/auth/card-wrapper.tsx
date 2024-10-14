
import React, { memo } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '../ui/button';

interface CardWrapperProps {
    children: React.ReactNode;
    cardTitle: string | React.ReactNode;
    cardDescription: string;
    backButtonLabel?: string;
    backButtonText?: string;
    backButtonHref?: string;
}

const CardWrapper: React.FC<CardWrapperProps> = ({
    children,
    cardTitle,
    cardDescription,
    backButtonLabel,
    backButtonHref,
    backButtonText,
}) => {
    return (
        <Card className="w-full max-w-md mx-auto shadow-lg">
            <CardHeader className='text-center'>
                <CardTitle className="text-3xl font-bold flex justify-center items-center">{cardTitle}</CardTitle>
                <CardDescription>{cardDescription}</CardDescription>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {backButtonHref && (
                <CardFooter>
                    <div className='w-full text-sm text-center text-muted-foreground'>
                        {backButtonLabel}{" "}
                        <Link href={backButtonHref} aria-label={backButtonText}>
                            <Button variant={"link"} className='px-1'>{backButtonText}</Button>
                        </Link>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}

export default memo(CardWrapper);
