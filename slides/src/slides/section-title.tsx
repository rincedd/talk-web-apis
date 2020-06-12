import React, {ReactNode} from "react";
import {FlexBox, Heading, Box} from "spectacle";

export function SectionTitle({children}: { children: ReactNode }) {
    return <FlexBox position="absolute" top={0} bottom={0} left={0} right={0} alignItems="center" justifyContent="center"><Box>
        <Heading className="section-title">{children}</Heading>
    </Box>
    </FlexBox>
}
