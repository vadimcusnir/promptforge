import { describe, it, expect } from "@jest/globals";
import { NextRequest } from "next/server";
import {
  API_ERROR_CODES,
  StandardAPIError,
  createErrorResponse,
  createRateLimitResponse,
  createValidationErrorResponse,
  createEntitlementErrorResponse,
  create7DErrorResponse,
  createSuccessResponse,
  createCORSResponse,
  withErrorHandler,
} from "../../lib/server/errors";

describe("Standardized Error System", () => {
  describe("API_ERROR_CODES", () => {
    it("should have correct error codes and status mappings", () => {
      // Test 400 errors
      expect(API_ERROR_CODES.INVALID_7D_ENUM.code).toBe(400);
      expect(API_ERROR_CODES.INVALID_7D_ENUM.type).toBe("INVALID_7D_ENUM");

      // Test 401 errors
      expect(API_ERROR_CODES.UNAUTHENTICATED.code).toBe(401);
      expect(API_ERROR_CODES.UNAUTHENTICATED.type).toBe("UNAUTHENTICATED");

      // Test 403 errors
      expect(API_ERROR_CODES.ENTITLEMENT_REQUIRED.code).toBe(403);
      expect(API_ERROR_CODES.ENTITLEMENT_REQUIRED.type).toBe(
        "ENTITLEMENT_REQUIRED",
      );

      // Test 404 errors
      expect(API_ERROR_CODES.MODULE_NOT_FOUND.code).toBe(404);
      expect(API_ERROR_CODES.MODULE_NOT_FOUND.type).toBe("MODULE_NOT_FOUND");

      // Test 422 errors
      expect(API_ERROR_CODES.INPUT_SCHEMA_MISMATCH.code).toBe(422);
      expect(API_ERROR_CODES.INPUT_SCHEMA_MISMATCH.type).toBe(
        "INPUT_SCHEMA_MISMATCH",
      );

      // Test 429 errors
      expect(API_ERROR_CODES.RATE_LIMITED.code).toBe(429);
      expect(API_ERROR_CODES.RATE_LIMITED.type).toBe("RATE_LIMITED");

      // Test 500 errors
      expect(API_ERROR_CODES.INTERNAL_RUN_ERROR.code).toBe(500);
      expect(API_ERROR_CODES.INTERNAL_RUN_ERROR.type).toBe(
        "INTERNAL_RUN_ERROR",
      );
    });

    it("should have consistent error message format", () => {
      Object.values(API_ERROR_CODES).forEach((errorConfig) => {
        expect(errorConfig.message).toBeDefined();
        expect(typeof errorConfig.message).toBe("string");
        expect(errorConfig.message.length).toBeGreaterThan(0);
      });
    });
  });

  describe("StandardAPIError", () => {
    it("should create error with correct properties", () => {
      const error = new StandardAPIError("INVALID_7D_ENUM", {
        field: "domain",
      });

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe("StandardAPIError");
      expect(error.apiCode).toBe("INVALID_7D_ENUM");
      expect(error.code).toBe(400);
      expect(error.type).toBe("INVALID_7D_ENUM");
      expect(error.message).toBe("Invalid 7D enum value");
      expect(error.details).toEqual({ field: "domain" });
    });

    it("should accept custom message", () => {
      const customMessage = "Custom error message";
      const error = new StandardAPIError(
        "UNAUTHENTICATED",
        null,
        customMessage,
      );

      expect(error.message).toBe(customMessage);
      expect(error.code).toBe(401);
      expect(error.type).toBe("UNAUTHENTICATED");
    });
  });

  describe("createErrorResponse", () => {
    it("should create proper error response", async () => {
      const response = createErrorResponse("INVALID_7D_ENUM", {
        field: "domain",
      });

      expect(response.status).toBe(400);

      const body = await response.json();
      expect(body).toEqual({
        error: "INVALID_7D_ENUM",
        message: "Invalid 7D enum value",
        details: { field: "domain" },
      });

      // Check security headers
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(response.headers.get("X-Frame-Options")).toBe("DENY");
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
        "https://chatgpt-prompting.com",
      );
    });

    it("should handle custom message", async () => {
      const customMessage = "Custom validation error";
      const response = createErrorResponse(
        "INPUT_SCHEMA_MISMATCH",
        null,
        customMessage,
      );

      expect(response.status).toBe(422);

      const body = await response.json();
      expect(body.message).toBe(customMessage);
      expect(body.error).toBe("INPUT_SCHEMA_MISMATCH");
    });
  });

  describe("createRateLimitResponse", () => {
    it("should create rate limit response with headers", async () => {
      const response = createRateLimitResponse(5, Date.now() + 60000);

      expect(response.status).toBe(429);

      const body = await response.json();
      expect(body.error).toBe("RATE_LIMITED");
      expect(body.details.remaining).toBe(5);

      // Check rate limit headers
      expect(response.headers.get("X-RateLimit-Limit")).toBe("30");
      expect(response.headers.get("X-RateLimit-Remaining")).toBe("5");
      expect(response.headers.get("X-RateLimit-Reset")).toBeDefined();
    });
  });

  describe("createValidationErrorResponse", () => {
    it("should create validation error response", async () => {
      const zodError = {
        errors: [
          {
            path: ["sevenD", "domain"],
            message: "Invalid enum value",
            code: "invalid_enum_value",
          },
          {
            path: ["prompt"],
            message: "String must contain at least 10 character(s)",
            code: "too_small",
          },
        ],
      };

      const response = createValidationErrorResponse(zodError);

      expect(response.status).toBe(422);

      const body = await response.json();
      expect(body.error).toBe("INPUT_SCHEMA_MISMATCH");
      expect(body.details.validation_errors).toHaveLength(2);
      expect(body.details.validation_errors[0]).toEqual({
        field: "sevenD.domain",
        message: "Invalid enum value",
        code: "invalid_enum_value",
      });
    });
  });

  describe("createEntitlementErrorResponse", () => {
    it("should create entitlement error with single requirement", async () => {
      const response = createEntitlementErrorResponse(
        "canUseGptTestReal",
        "free",
      );

      expect(response.status).toBe(403);

      const body = await response.json();
      expect(body.error).toBe("ENTITLEMENT_REQUIRED");
      expect(body.details.required_entitlements).toEqual(["canUseGptTestReal"]);
      expect(body.details.current_plan).toBe("free");
    });

    it("should create entitlement error with multiple requirements", async () => {
      const response = createEntitlementErrorResponse([
        "hasAPI",
        "plan_enterprise",
      ]);

      const body = await response.json();
      expect(body.details.required_entitlements).toEqual([
        "hasAPI",
        "plan_enterprise",
      ]);
    });
  });

  describe("create7DErrorResponse", () => {
    it("should create 7D validation error", async () => {
      const response = create7DErrorResponse("domain", "invalid_value", [
        "fintech",
        "saas",
      ]);

      expect(response.status).toBe(400);

      const body = await response.json();
      expect(body.error).toBe("INVALID_7D_ENUM");
      expect(body.message).toBe("Invalid 7D enum value for field: domain");
      expect(body.details.invalid_field).toBe("domain");
      expect(body.details.invalid_value).toBe("invalid_value");
      expect(body.details.allowed_values).toEqual(["fintech", "saas"]);
    });
  });

  describe("createSuccessResponse", () => {
    it("should create success response with security headers", async () => {
      const data = { result: "success", value: 42 };
      const response = createSuccessResponse(data, 201);

      expect(response.status).toBe(201);

      const body = await response.json();
      expect(body).toEqual(data);

      // Check security headers
      expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
      expect(response.headers.get("X-Frame-Options")).toBe("DENY");
    });
  });

  describe("createCORSResponse", () => {
    it("should create proper CORS preflight response", () => {
      const response = createCORSResponse();

      expect(response.status).toBe(200);
      expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
        "https://chatgpt-prompting.com",
      );
      expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
        "GET, POST, OPTIONS",
      );
      expect(response.headers.get("Access-Control-Allow-Headers")).toContain(
        "x-pf-key",
      );
      expect(response.headers.get("Access-Control-Max-Age")).toBe("86400");
    });
  });

  describe("withErrorHandler", () => {
    it("should handle StandardAPIError", async () => {
      const handler = jest
        .fn()
        .mockRejectedValue(
          new StandardAPIError("INVALID_7D_ENUM", { field: "domain" }),
        );

      const wrappedHandler = withErrorHandler(handler);
      const mockRequest = new NextRequest("http://localhost/test");

      const response = await wrappedHandler(mockRequest);

      expect(response.status).toBe(400);

      const body = await response.json();
      expect(body.error).toBe("INVALID_7D_ENUM");
      expect(body.details.field).toBe("domain");
    });

    it("should handle Zod validation errors", async () => {
      const zodError = {
        issues: [
          {
            path: ["field"],
            message: "Invalid value",
            code: "invalid_type",
          },
        ],
      };

      const handler = jest.fn().mockRejectedValue(zodError);
      const wrappedHandler = withErrorHandler(handler);
      const mockRequest = new NextRequest("http://localhost/test");

      const response = await wrappedHandler(mockRequest);

      expect(response.status).toBe(422);

      const body = await response.json();
      expect(body.error).toBe("INPUT_SCHEMA_MISMATCH");
    });

    it("should handle OpenAI API errors", async () => {
      const openaiError = { status: 503, message: "Service unavailable" };

      const handler = jest.fn().mockRejectedValue(openaiError);
      const wrappedHandler = withErrorHandler(handler);
      const mockRequest = new NextRequest("http://localhost/test");

      const response = await wrappedHandler(mockRequest);

      expect(response.status).toBe(503);

      const body = await response.json();
      expect(body.error).toBe("INTERNAL_RUN_ERROR");
    });

    it("should handle generic errors", async () => {
      const genericError = new Error("Something went wrong");

      const handler = jest.fn().mockRejectedValue(genericError);
      const wrappedHandler = withErrorHandler(handler);
      const mockRequest = new NextRequest("http://localhost/test");

      const response = await wrappedHandler(mockRequest);

      expect(response.status).toBe(500);

      const body = await response.json();
      expect(body.error).toBe("INTERNAL_RUN_ERROR");
    });

    it("should pass through successful responses", async () => {
      const successData = { success: true };
      const successResponse = createSuccessResponse(successData);

      const handler = jest.fn().mockResolvedValue(successResponse);
      const wrappedHandler = withErrorHandler(handler);
      const mockRequest = new NextRequest("http://localhost/test");

      const response = await wrappedHandler(mockRequest);

      expect(response.status).toBe(200);

      const body = await response.json();
      expect(body).toEqual(successData);
    });
  });

  describe("Error Code Consistency", () => {
    it("should map all specified error codes correctly", () => {
      const specifiedErrors = [
        { code: "INVALID_7D_ENUM", status: 400 },
        { code: "MISSING_OUTPUT_FORMAT", status: 400 },
        { code: "UNAUTHENTICATED", status: 401 },
        { code: "ENTITLEMENT_REQUIRED", status: 403 },
        { code: "MODULE_NOT_FOUND", status: 404 },
        { code: "RULESET_CONFLICT", status: 409 },
        { code: "INPUT_SCHEMA_MISMATCH", status: 422 },
        { code: "SEVEND_SIGNATURE_MISMATCH", status: 422 },
        { code: "RATE_LIMITED", status: 429 },
        { code: "INTERNAL_RUN_ERROR", status: 500 },
      ];

      specifiedErrors.forEach(({ code, status }) => {
        const errorConfig =
          API_ERROR_CODES[code as keyof typeof API_ERROR_CODES];
        expect(errorConfig).toBeDefined();
        expect(errorConfig.code).toBe(status);
        expect(errorConfig.type).toBeDefined();
        expect(errorConfig.message).toBeDefined();
      });
    });

    it("should have consistent error type naming", () => {
      Object.entries(API_ERROR_CODES).forEach(([key, config]) => {
        // Error type should match the key or be a standardized variant
        const validTypes = [
          key,
          "INVALID_7D_ENUM",
          "UNAUTHENTICATED",
          "ENTITLEMENT_REQUIRED",
          "MODULE_NOT_FOUND",
          "RULESET_CONFLICT",
          "INPUT_SCHEMA_MISMATCH",
          "RATE_LIMITED",
          "INTERNAL_RUN_ERROR",
        ];
        expect(validTypes).toContain(config.type);
      });
    });
  });
});
