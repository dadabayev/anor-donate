import cn from './error-message.module.css'

import { Box, Flex, Text, Title } from '@mantine/core'
import { ReactSVG } from 'react-svg'

interface IErrorMessageProps {
  title: string
  text: string
  image: string
}

export const ErrorMessage = ({
  title,
  text,
  image,
}: Readonly<IErrorMessageProps>) => {
  return (
    <Box className={cn.container}>
      <Flex direction={'column'} align={'center'} gap={24}>
        <Box w={320} h={320}>
          <ReactSVG src={image} />
        </Box>
        <Box ta={'center'}>
          <Title fz={30} fw={800}>
            {title}
          </Title>
          <Text mt={10}>{text}</Text>
        </Box>
      </Flex>
    </Box>
  )
}
