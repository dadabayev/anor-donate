import cn from './loader.module.css'

import { Box, Loader as MantineLoader } from '@mantine/core'

export const Loader = () => {
  return (
    <Box className={cn.loader}>
      <MantineLoader type="dots" />
    </Box>
  )
}
