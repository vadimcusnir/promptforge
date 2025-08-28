import { render, screen } from '@testing-library/react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ComingSoonWrapper } from '@/components/coming-soon-wrapper'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}))

const mockUsePathname = require('next/navigation').usePathname

describe('Layout Structure Tests', () => {
  beforeEach(() => {
    // Reset environment variable
    delete process.env.NEXT_PUBLIC_COMING_SOON
    mockUsePathname.mockReturnValue('/')
  })

  describe('Header Component', () => {
    it('should have banner role for accessibility', () => {
      render(<Header />)
      const header = screen.getByRole('banner')
      expect(header).toBeInTheDocument()
    })

    it('should have proper navigation structure', () => {
      render(<Header />)
      const nav = screen.getByRole('navigation')
      expect(nav).toBeInTheDocument()
    })
  })

  describe('Footer Component', () => {
    it('should have contentinfo role for accessibility', () => {
      render(<Footer />)
      const footer = screen.getByRole('contentinfo')
      expect(footer).toBeInTheDocument()
    })
  })

  describe('ComingSoonWrapper', () => {
    it('should not render header/footer on coming-soon page', () => {
      mockUsePathname.mockReturnValue('/coming-soon')
      
      render(
        <ComingSoonWrapper>
          <div>Coming Soon Content</div>
        </ComingSoonWrapper>
      )
      
      // Should not have header or footer
      expect(screen.queryByRole('banner')).not.toBeInTheDocument()
      expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
      expect(screen.getByText('Coming Soon Content')).toBeInTheDocument()
    })

    it('should not render header/footer when coming soon mode is enabled', () => {
      process.env.NEXT_PUBLIC_COMING_SOON = 'true'
      mockUsePathname.mockReturnValue('/')
      
      render(
        <ComingSoonWrapper>
          <div>Coming Soon Mode Content</div>
        </ComingSoonWrapper>
      )
      
      // Should not have header or footer
      expect(screen.queryByRole('banner')).not.toBeInTheDocument()
      expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
      expect(screen.getByText('Coming Soon Mode Content')).toBeInTheDocument()
    })

    it('should wrap content in main tag for regular pages', () => {
      mockUsePathname.mockReturnValue('/dashboard')
      
      render(
        <ComingSoonWrapper>
          <div>Dashboard Content</div>
        </ComingSoonWrapper>
      )
      
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      expect(main).toHaveClass('flex-1')
      expect(screen.getByText('Dashboard Content')).toBeInTheDocument()
    })
  })

  describe('Layout Integration', () => {
    it('should maintain single header/footer structure', () => {
      // This test verifies that the layout structure prevents duplication
      // The root layout should have exactly one Header and one Footer
      // and the ComingSoonWrapper should not add additional ones
      
      mockUsePathname.mockReturnValue('/dashboard')
      
      render(
        <ComingSoonWrapper>
          <div>Page Content</div>
        </ComingSoonWrapper>
      )
      
      // Should not have multiple main elements
      const mainElements = screen.queryAllByRole('main')
      expect(mainElements).toHaveLength(1)
      
      // Should not have multiple banner/contentinfo elements
      const bannerElements = screen.queryAllByRole('banner')
      const contentinfoElements = screen.queryAllByRole('contentinfo')
      
      // These should be 0 because Header/Footer are not rendered in this test
      // The actual layout integration test would be in an integration test
      expect(bannerElements).toHaveLength(0)
      expect(contentinfoElements).toHaveLength(0)
    })
  })
})
