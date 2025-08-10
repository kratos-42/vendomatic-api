import { SetMetadata } from '@nestjs/common';

import { TIMEOUT_KEY } from '@common/constants/log.constants';

/**
 * Set custom timeout for a specific operation
 */

export const Timeout = (ms: number) => SetMetadata(TIMEOUT_KEY, ms);
