/**
 * AdonisJS type augmentations for HttpContext, VineJS, and related interfaces.
 *
 * IMPORTANT: The `export {}` below is REQUIRED. It makes this file a TypeScript
 * "module" (vs. a "script"). Only in module context do `declare module` blocks
 * act as augmentations that MERGE with the real module types.
 */
export {}

// ─── @adonisjs/core/http ───────────────────────────────────────────────────
declare module '@adonisjs/core/http' {
  interface HttpContext {
    /** Session store – provided by @adonisjs/session session_middleware */
    session: import('@adonisjs/session').Session
    /** Authenticator – provided by @adonisjs/auth initialize_auth_middleware */
    auth: import('@adonisjs/auth').Authenticator<any>
    /** Inertia renderer – provided by @adonisjs/inertia inertia_middleware */
    inertia: import('@adonisjs/inertia').Inertia<any>
    /** API Response Serializer – provided by ApiProvider */
    serialize?: any
    /** Edge View Renderer – provided by edge_provider */
    view?: any
  }

  interface HttpRequest {
    /** Validates the request body using a VineJS schema */
    validateUsing<T = any>(schema: any, options?: any): Promise<T>
  }

  interface BriskRoute {
    /** Renders an Inertia page without an explicit controller handler */
    renderInertia(
      component: string,
      props?: Record<string, any>,
      viewProps?: Record<string, any>
    ): any
  }
}

// ─── @adonisjs/http-server ──────────────────────────────────────────────────
declare module '@adonisjs/http-server' {
  interface HttpContext {
    /** Session store – provided by @adonisjs/session session_middleware */
    session: import('@adonisjs/session').Session
    /** Authenticator – provided by @adonisjs/auth initialize_auth_middleware */
    auth: import('@adonisjs/auth').Authenticator<any>
    /** Inertia renderer – provided by @adonisjs/inertia inertia_middleware */
    inertia: import('@adonisjs/inertia').Inertia<any>
    /** API Response Serializer – provided by ApiProvider */
    serialize?: any
    /** Edge View Renderer – provided by edge_provider */
    view?: any
  }

  interface Request {
    /** Validates the request body using a VineJS schema */
    validateUsing<T = any>(schema: any, options?: any): Promise<T>
  }
}

// ─── @vinejs/vine ──────────────────────────────────────────────────────────
declare module '@vinejs/vine' {
  interface Vine {
    /** Multipart file validation rule – provided by @adonisjs/core vinejs_provider */
    file(options?: Record<string, any>): any
  }

  interface VineString {
    /** Unique value check against a database – provided by @adonisjs/lucid */
    unique(options: any): this
  }
}
